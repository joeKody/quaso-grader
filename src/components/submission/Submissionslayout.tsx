'use client'

import Editor from '@monaco-editor/react'
import { Card } from '../ui/card'
import Link from 'next/link'
import { formatDateTime } from '@/app/submissions/columns'
import { useEffect, useState } from 'react'
import { cx } from 'class-variance-authority'

export type SubmissionData = {
  id: number
  taskTitle: string
  taskId: string
  submittedAt: string
  status: string
  time: number
  memory: number
  code: string
  score: number
  result: Array<Object>
  language: string
  username: string
}

async function getSubmission(submissionId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/submissions/${submissionId}`,
    {
      method: 'GET',
    }
  )
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  return data
}

async function getUser(userId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
    {
      method: 'GET',
    }
  )
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  return data
}

async function getTask(taskId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
    {
      method: 'GET',
    }
  )
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  return data
}

export default function SubmissionLayout({ id }: { id: string }) {
  const [status, setStatus] = useState('')
  const [submission, setSubmission] = useState<SubmissionData>({
    id: 99999,
    taskTitle: '',
    taskId: '',
    submittedAt: '',
    status: '',
    time: 0,
    memory: 0,
    code: '',
    score: 0,
    result: [],
    language: 'c',
    username: '',
  })

  const fetchSubmission = async () => {
    const submission = await getSubmission(id)
    if (submission) {
      const [User, Task] = await Promise.all([
        getUser(submission.userId),
        getTask(submission.taskId),
      ])
      submission.username = User.username
      submission.taskTitle = Task.title
      setSubmission(submission)
      setStatus(submission.status)
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    const startFetching = async () => {
      await fetchSubmission()
      if (status === 'Pending' || status === 'Judging') {
        interval = setInterval(fetchSubmission, 1000 * 5)
      }
    }

    startFetching()

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [id, status])

  const languageList = [
    {
      name: 'C',
      language: 'c',
      ext: 'c',
    },
    {
      name: 'C++',
      language: 'cpp',
      ext: 'cpp',
    },
    {
      name: 'Python',
      language: 'python',
      ext: 'py',
    },
  ]
  const findLanguage = languageList.filter(
    (lang) => lang.language === submission.language
  )
  const displayLanguage = findLanguage[0].name

  let style = 'bg-yellow-500 dark:bg-yellow-900'

  if (status === 'Completed') {
    style = 'bg-green-500 dark:bg-green-900'
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="font-bold">Submission : {submission.id}</p>
      <div className="inline">
        <p className="inline font-bold">Status : </p>
        <div
          className={cx(
            'px-2.5 py-0.5 rounded text-white font-medium w-fit inline',
            style
          )}
        >
          {submission.status}
        </div>
      </div>
      <div className="inline">
        <p className="inline font-bold">Task : </p>
        <Link href={`/tasks/${submission.taskId}`} className="inline underline">
          {submission.taskTitle}
        </Link>
      </div>
      <div className="inline pt-2">
        <p className="inline font-bold">Submitted At : </p>
        <p className="inline">
          {formatDateTime(submission.submittedAt).formattedDate}{' '}
          {formatDateTime(submission.submittedAt).formattedTime}
        </p>
      </div>
      <div className="inline">
        <p className="inline font-bold">User : </p>
        <p className="inline">{submission.username} </p>
        <p className="inline font-bold">Language : </p>
        <p className="inline">{displayLanguage}</p>
      </div>
      <div className="inline">
        <p className="inline font-bold">Score : </p>
        <p className="inline">{submission.score} </p>
        <p className="inline font-bold">Time : </p>
        <p className="inline">{submission.time} ms </p>
        <p className="inline font-bold">Memory : </p>
        <p className="inline">{submission.memory} KB</p>
      </div>
      <div className="flex flex-col mt-5 space-y-4 lg:flex-row sm:space-x-4">
        <Card className="w-[350px] sm:w-[500px] xl:w-[700px] 2xl:w-[800px] h-[600px] overflow-hidden">
          <Editor
            language={submission.language}
            value={submission.code}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              fontLigatures: true,
              readOnly: true,
            }}
            className="caret-transparent monaco-font"
          />
        </Card>
      </div>
    </div>
  )
}
