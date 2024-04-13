import TasksTable from '@/components/Taskstable'
import { columns } from './columns'
import { Suspense } from 'react'
import { headers } from 'next/headers'

async function getTaskList() {
  // await new Promise((resolve) => setTimeout(resolve, 3000))
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
    method: 'GET',
    headers: headers(),
  })
  const data = await res.json()
  return data
}

export default async function Tasks() {
  const taskList = await getTaskList()

  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center py-10">
        <div className="mb-5 md:mb-8">
          <h1 className="text-3xl font-bold">TASKS</h1>
        </div>
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center h-screen py-10">
              <p className="text-base animate-pulse">Loading...</p>
            </div>
          }
        >
          <TasksTable columns={columns} data={taskList} />
        </Suspense>
      </div>
    </div>
  )
}
