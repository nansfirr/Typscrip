export default async function pastContact(
    name: string, 
    email: string, 
    message: string):
    Promise<unknown> {
    const res = await fetch("/api/contact", {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name, email, message}),
    });

    if (!res.ok) {
        throw new Error("Response gagal.");
    }

    return res.json();
}