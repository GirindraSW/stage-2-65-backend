export interface Post{
    id:number,
    title:string,
    content:string,
}

// DUmmy data
export const posts:Post[]=[
    {id:1, title:"Post pertama", content:"content ke-1"},
    {id:2, title:"Post kedua", content:"content ke-2"}
]