export function validatePassword(password: string) : boolean {
    return password.length >= 6
}

export function validateEmail(email: string): boolean {
    const re =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

export function sanitizeSlug(slug: string): string {
    return slug.toLocaleLowerCase().replace(/[^a-z0-9-]/g, '');
}