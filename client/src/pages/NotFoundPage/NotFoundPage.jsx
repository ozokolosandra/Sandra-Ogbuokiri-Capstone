import React from 'react'
import "./NotFoundPage.scss"
import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div>
      <div className="not__found">
      <h1 className='not__found-title'>404</h1>
      <h2>Oops! Page Not Found</h2>
      <p>
        The page you're looking for doesn't exist or has been moved. Please go
        back to the homepage.
      </p>
      <Link to="/" className="not__found__link">
        Go to Homepage
      </Link>
    </div>
    </div>
  )
}
