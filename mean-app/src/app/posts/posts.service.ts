import { Post } from './post.model'
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient, private router: Router) {

    }

    getPosts() {
        //Angular handles the unsubscribe in http built in function
        this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
            //Pipe and map to convert _id to id just before subscribing
            .pipe(map(postData => {
                return postData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id
                    }
                });
            }))
            .subscribe((transformedPosts) => {
                this.posts = transformedPosts;
                this.postsUpdated.next([...this.posts]);
            });
    }

    getPost(id: string){
        return this.http.get<{_id: string, title: string, content: string}>("http://localhost:3000/api/posts/"+id)
    }

    updatePost(id: string, title: string, content: string){
        const post: Post = {id: id, title: title, content: content};
        this.http.put("http://localhost:3000/api/posts/"+id, post)
            .subscribe(response=>{
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex(p=>p.id === post.id);
                updatedPosts[oldPostIndex] = post;
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(["/"]);
            })
    }

    // Every component which subscribes to it will have its posts updated. 
    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    addPost(title: String, content: String) {
        const post: Post = { id: null, title: title, content: content };
        this.http.post<{ message: string, postId: string }>("http://localhost:3000/api/posts", post)
            .subscribe(responseData => {
                post.id = responseData.postId;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(["/"]);
            })
    }

    deletePost(postId: string){
        this.http.delete("http://localhost:3000/api/posts/" + postId)
            .subscribe(()=>{
                const updatedPosts = this.posts.filter(post=>post.id !== postId);
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts])
            })
    }
}