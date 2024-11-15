import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const parseTime = (time: string | Date | number, format = 'YY-MM-DD hh:ii:ss') => {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const padLeft = (str: string | number) => {
    return `${str}`.padStart(2, '0')
  }
  return format.replace('YY', year.toString())
    .replace('MM', padLeft(month))
    .replace('DD', padLeft(day))
    .replace('hh', padLeft(hour))
    .replace('ii', padLeft(minute))
    .replace('ss', padLeft(second))

}

export const getUUID = (len: number = 8) => {
  return Math.random().toString(36).substring(2, len)
}

export const parseTimeAgo = (time: string | Date) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const second = 1000
  const minute = 60 * second

  if (diff < minute) {
    return '刚刚'
  } else if (diff < minute * 10) {
    return `${Math.floor(diff / minute)}分钟前`
  } else
    return parseTime(time)

}

const toString = Object.prototype.toString

/**
 * @description: 判断值是否未某个类型
 */
export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

/**
 * @description:  是否为字符串
 */
export function isString(val: unknown): val is string {
  return is(val, 'String')
}