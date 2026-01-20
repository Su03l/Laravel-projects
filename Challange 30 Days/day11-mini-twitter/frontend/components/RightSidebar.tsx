'use client';

import { Search } from 'lucide-react';

export default function RightSidebar() {
    return (
        <aside className="right-sidebar">
            <div className="search-box">
                <Search size={18} className="search-icon" />
                <input type="text" placeholder="Search" className="search-input" />
            </div>

            {/* Who to follow */}
            <div className="who-to-follow">
                <h2>Who to follow</h2>
                <div className="follow-suggestion">
                    <div className="follow-avatar">E</div>
                    <div className="follow-info">
                        <span className="follow-name">Elon Musk</span>
                        <span className="follow-username">@elonmusk</span>
                    </div>
                    <button className="follow-btn">Follow</button>
                </div>
                <div className="follow-suggestion">
                    <div className="follow-avatar">S</div>
                    <div className="follow-info">
                        <span className="follow-name">Sam Altman</span>
                        <span className="follow-username">@sama</span>
                    </div>
                    <button className="follow-btn">Follow</button>
                </div>
                <div className="follow-suggestion">
                    <div className="follow-avatar">L</div>
                    <div className="follow-info">
                        <span className="follow-name">Laravel</span>
                        <span className="follow-username">@laaboratory</span>
                    </div>
                    <button className="follow-btn">Follow</button>
                </div>
            </div>

            {/* Trending */}
            <div className="trending">
                <h2>Trending</h2>
                <div className="trend-item">
                    <span className="trend-category">Technology · Trending</span>
                    <span className="trend-name">#NextJS</span>
                    <span className="trend-posts">12.5K posts</span>
                </div>
                <div className="trend-item">
                    <span className="trend-category">Development · Trending</span>
                    <span className="trend-name">#Laravel</span>
                    <span className="trend-posts">8.2K posts</span>
                </div>
            </div>
        </aside>
    );
}
