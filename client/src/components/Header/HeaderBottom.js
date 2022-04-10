import React from 'react'

export default function HeaderBottom() {
  return (
    <div className="post__top">
    <div className="post__top--logo">
        <img src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YmFieXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60" alt="header" className="post__top--img" />
    </div>
    <div className="post__top--search">
        <i className="fa fa-search" />
        <input type="text" className="post__top--input" placeholder="Enter your search..." />
    </div>
</div>
  )
}
