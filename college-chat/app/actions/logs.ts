"use server"

import { clearLogs } from '@/lib/logger'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function clearLogsAction(): Promise<void> {
  await clearLogs()
  revalidatePath('/logs')
  redirect('/logs')
}
