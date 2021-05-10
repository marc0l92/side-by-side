declare module '*.pdf' {
    const pdf: string
    export = pdf
}

declare module '*.css' {
    const css: { [k: string]: string }
    export = css
}