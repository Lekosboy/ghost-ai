import { clerkClient } from '@clerk/nextjs/server'

export interface ClerkUserSummary {
  email: string
  name: string | null
  imageUrl: string | null
}

function buildName(
  firstName: string | null,
  lastName: string | null,
  username: string | null,
): string | null {
  const full = [firstName, lastName]
    .filter((p): p is string => Boolean(p && p.trim()))
    .join(' ')
    .trim()
  return full || username || null
}

export async function getClerkUserById(
  userId: string,
): Promise<ClerkUserSummary | null> {
  const client = await clerkClient()
  try {
    const user = await client.users.getUser(userId)
    const primaryEmail =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress ?? user.emailAddresses[0]?.emailAddress
    if (!primaryEmail) return null
    return {
      email: primaryEmail,
      name: buildName(user.firstName, user.lastName, user.username),
      imageUrl: user.imageUrl ?? null,
    }
  } catch {
    return null
  }
}

export async function getClerkUsersByEmail(
  emails: string[],
): Promise<Map<string, ClerkUserSummary>> {
  const result = new Map<string, ClerkUserSummary>()
  const unique = Array.from(new Set(emails.map((e) => e.toLowerCase())))
  if (unique.length === 0) return result

  const client = await clerkClient()
  const { data } = await client.users.getUserList({
    emailAddress: unique,
    limit: Math.max(unique.length, 1),
  })

  for (const user of data) {
    const primaryEmail =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress ?? user.emailAddresses[0]?.emailAddress
    if (!primaryEmail) continue

    result.set(primaryEmail.toLowerCase(), {
      email: primaryEmail,
      name: buildName(user.firstName, user.lastName, user.username),
      imageUrl: user.imageUrl ?? null,
    })
  }

  return result
}
