import prisma from '@/lib/prisma'
import { json, unauthorized } from '@/utils/apiResponse'
import { getServerUser } from '@/lib/session'

export async function GET() {
  const user = await getServerUser()
  if (!user) return unauthorized()

  const res = await prisma.task.findMany({
    orderBy: {
      id: 'asc',
    },
  })
  return json(res)
}
