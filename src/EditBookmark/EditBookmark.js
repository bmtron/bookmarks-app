import React, { Component } from 'react';
import BookmarksContext from '../BookmarksContext';

export default class EditBookmark extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            title: '',
            url: '',
            rating: 1,
            description: '',
            error: null
        }
    }
    static contextType = BookmarksContext;

    componentDidMount() {
        const bookmarkId = this.props.match.params.bookmarkId
        console.log(bookmarkId);
        fetch(`http://localhost:8000/api/bookmarks/${bookmarkId}`, {
            method: 'GET'
        })
        .then(res => {
            if(!res.ok) {
                return res.json().then(error => Promise.reject(error));
            }
            return res.json();
        })
        .then(response => {
            console.log(response)
            this.setState({
                id: response.id,
                title: response.title,
                url: response.url,
                rating: response.rating,
                description: response.description
            });
        })
        .catch(error => {
            this.setState({
                error
            });
        });
    }
    handleChangeTitle = (event) => {
        this.setState({
            title: event.target.value
        })
    }
    handleChangeUrl = (event) => {
        this.setState({
           url: event.target.value
        })
    }   
    handleChangeRating = (event) => {
        this.setState({
           rating: event.target.rating})
    }
    handleChangeDescription = (event) => {
        this.setState({
            description: event.target.description
        })
    }
    handleSubmit = e => {
        e.preventDefault();
        const { id, title, url, rating, description} = this.state;
        const newBookmark = { id, title, url, rating, description };
        console.log(newBookmark)
        fetch(`http://localhost:8000/api/bookmarks/${this.props.match.params.bookmarkId}`, {
            method: 'PATCH',
            body: JSON.stringify(newBookmark),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(error => Promise.reject(error))
            }
        })
        .then(() => {
            this.context.updateBookmark(newBookmark);
            this.props.history.push('/')
        })
        .catch(error => {
            this.setState({
                error
            })
        })
    }
    render() {
        const {title, url, rating, description } = this.state
        return (
            <section className="edit_bookmark_form">
                <h2>Edit Bookmark</h2>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="title">Title</label>
                    <input 
                        name="title" 
                        id="title" 
                        type="text" 
                        defaultValue={title}
                        
                        onChange={this.handleChangeTitle}
                        required
                        />
                    
                    <label htmlFor="url">URL</label>
                    <input 
                        name="url" 
                        id="url" 
                        type="text" 
                        defaultValue={url} 
                        
                        onChange={this.handleChangeUrl}
                        required
                        />
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        name='description'
                        id='description'
                        defaultValue={description}
                        
                        onChange={this.handleChangeDescription}
                        required
                        />
                    <label htmlFor="rating">Rating</label>
                    <input
                        type='number'
                        name='rating'
                        id='rating'
                        defaultValue={rating}
                        
                        onChange={this.handleChangeRating}
                        min='1'
                        max='5'
                        required
                        />
                    <button type="submit">Update Bookmark</button>
                </form>
            </section>
        )
    }
}