export function formatMinutesSeconds(number: number) {
    const minutes = Math.floor(number / 60)
    const seconds = `${number % 60}`.padStart(2, "0")

    return `${minutes}:${seconds}`
}