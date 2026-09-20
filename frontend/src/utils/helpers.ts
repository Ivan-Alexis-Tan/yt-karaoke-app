export function formatMinutesSeconds(number: number) {
    const minutes = Math.floor(number / 60)
    const seconds = `${number % 60}`.padStart(2, "0")

    return `${minutes}:${seconds}`
}

export function capsWord(str_word: string) {
    return `${str_word}`.charAt(0).toLocaleUpperCase() + `${str_word}`.slice(1, `${str_word}`.length)
}