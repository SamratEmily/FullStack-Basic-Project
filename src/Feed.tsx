import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import '../assets/css/bootstrap.min.css';
import '../assets/css/common.css';
import '../assets/css/main.css';
import '../assets/css/responsive.css';

interface Post {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
  };
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface FeedProps {
  onLogout: () => void;
}

const Feed: React.FC<FeedProps> = ({ onLogout }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetchPosts();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.getUser();
      if (response.success && response.user) {
        setCurrentUser(response.user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await api.getPosts();
      if (response.success && response.posts) {
        setPosts(response.posts);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setLoading(true);
    try {
      const response = await api.createPost(newPostContent);
      if (response.success && response.post) {
        setPosts([response.post, ...posts]);
        setNewPostContent('');
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Still logout on frontend even if API call fails
      onLogout();
    }
  };

  return (
    <div className="_layout _layout_main_wrapper">
      {/* Theme Switcher */}
      <div className="_layout_mode_swithing_btn">
        <button type="button" className="_layout_swithing_btn_link">
          <div className="_layout_swithing_btn">
            <div className="_layout_swithing_btn_round"></div>
          </div>
        </button>
      </div>

      <div className="_main_layout">
        {/* Desktop Menu */}
        <nav className="navbar navbar-expand-lg navbar-light _header_nav _padd_t10">
          <div className="container _custom_container">
            <div className="_logo_wrap">
              <a className="navbar-brand" href="#0">
                <img src="assets/images/logo.svg" alt="Image" className="_nav_logo" />
              </a>
            </div>
            
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <div className="_header_form ms-auto">
                <form className="_header_form_grp">
                  <svg className="_header_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                    <circle cx="7" cy="7" r="6" stroke="#666" />
                    <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
                  </svg>
                  <input className="form-control me-2 _inpt1" type="search" placeholder="input search text" />
                </form>
              </div>
              
              <ul className="navbar-nav mb-2 mb-lg-0 _header_nav_list ms-auto _mar_r8">
                <li className="nav-item _header_nav_item">
                  <a className="nav-link _header_nav_link_active _header_nav_link" href="#0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" fill="none" viewBox="0 0 18 21">
                      <path className="_home_active" stroke="#000" strokeWidth="1.5" strokeOpacity=".6" d="M1 9.924c0-1.552 0-2.328.314-3.01.313-.682.902-1.187 2.08-2.196l1.143-.98C6.667 1.913 7.732 1 9 1c1.268 0 2.333.913 4.463 2.738l1.142.98c1.179 1.01 1.768 1.514 2.081 2.196.314.682.314 1.458.314 3.01v4.846c0 2.155 0 3.233-.67 3.902-.669.67-1.746.67-3.901.67H5.57c-2.155 0-3.232 0-3.902-.67C1 18.002 1 16.925 1 14.77V9.924z" />
                    </svg>
                  </a>
                </li>
                <li className="nav-item _header_nav_item">
                  <span 
                    className="nav-link _header_nav_link _header_notify_btn"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22">
                      <path fill="#000" fillOpacity=".6" fillRule="evenodd" d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057z" clipRule="evenodd" />
                    </svg>
                    <span className="_counting">6</span>
                  </span>
                </li>
              </ul>
              
              <div className="_header_nav_profile">
                <div className="_header_nav_profile_image">
                  <img src="assets/images/profile.png" alt="Image" className="_nav_profile_img" />
                </div>
                <div className="_header_nav_dropdown">
                  <p className="_header_nav_para">Dylan Field</p>
                  <button 
                    className="_header_nav_dropdown_btn _dropdown_toggle" 
                    type="button"
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" fill="none" viewBox="0 0 10 6">
                      <path fill="#112032" d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z" />
                    </svg>
                  </button>
                </div>
                
                {showProfileDropdown && (
                  <div className="_nav_profile_dropdown _profile_dropdown" style={{ display: 'block' }}>
                    <div className="_nav_profile_dropdown_info">
                      <div className="_nav_profile_dropdown_image">
                        <img src="assets/images/profile.png" alt="Image" className="_nav_drop_img" />
                      </div>
                      <div className="_nav_profile_dropdown_info_txt">
                        <h4 className="_nav_dropdown_title">Dylan Field</h4>
                        <a href="#0" className="_nav_drop_profile">View Profile</a>
                      </div>
                    </div>
                    <hr />
                    <ul className="_nav_dropdown_list">
                      <li className="_nav_dropdown_list_item">
                        <a href="#0" className="_nav_dropdown_link" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                          <div className="_nav_drop_info">
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                                <path stroke="#377DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.667 18H2.889A1.889 1.889 0 011 16.111V2.89A1.889 1.889 0 012.889 1h3.778M13.277 14.222L18 9.5l-4.723-4.722M18 9.5H6.667"/>
                              </svg>
                            </span>
                            Log Out
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              {/* Left Sidebar */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <div className="_layout_left_sidebar_wrap">
                  <div className="_layout_left_sidebar_inner">
                    <div className="_left_inner_area_explore _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                      <h4 className="_left_inner_area_explore_title _title5 _mar_b24">Explore</h4>
                      <ul className="_left_inner_area_explore_list">
                        <li className="_left_inner_area_explore_item">
                          <a href="#0" className="_left_inner_area_explore_link">Learning</a>
                        </li>
                        <li className="_left_inner_area_explore_item">
                          <a href="#0" className="_left_inner_area_explore_link">Insights</a>
                        </li>
                        <li className="_left_inner_area_explore_item">
                          <a href="#0" className="_left_inner_area_explore_link">Find friends</a>
                        </li>
                        <li className="_left_inner_area_explore_item">
                          <a href="#0" className="_left_inner_area_explore_link">Bookmarks</a>
                        </li>
                        <li className="_left_inner_area_explore_item">
                          <a href="#0" className="_left_inner_area_explore_link">Group</a>
                        </li>
                        <li className="_left_inner_area_explore_item">
                          <a href="#0" className="_left_inner_area_explore_link">Settings</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Content */}
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner">
                    <div className="_feed_inner_ppl_card _mar_b16">
                      <div className="row">
                        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4">
                          <div className="_feed_inner_profile_story _b_radious6">
                            <div className="_feed_inner_profile_story_image">
                              <img src="assets/images/card_ppl1.png" alt="Image" className="_profile_story_img" />
                              <div className="_feed_inner_story_txt">
                                <p className="_feed_inner_story_para">Your Story</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Post Creation */}
                    <div className="_feed_inner_area _padd_t24 _padd_b24 _padd_r24 _padd_l24 _b_radious6 _mar_b16">
                      <div className="_feed_inner_post_content">
                        <div className="_feed_inner_post_image">
                          <img src="assets/images/profile.png" alt="Image" className="_post_img" />
                        </div>
                        <div className="_feed_inner_post_input">
                          <input type="text" className="form-control _post_input" placeholder="What's on your mind?" />
                        </div>
                      </div>
                    </div>

                    {/* Sample Post */}
                    <div className="_feed_inner_area _padd_t24 _padd_b24 _padd_r24 _padd_l24 _b_radious6 _mar_b16">
                      <div className="_feed_inner_post_top">
                        <div className="_feed_inner_post_top_left">
                          <div className="_feed_inner_post_top_image">
                            <img src="assets/images/profile-1.png" alt="Image" className="_post_top_img" />
                          </div>
                          <div className="_feed_inner_post_top_txt">
                            <h4 className="_feed_inner_post_top_title">Steve Jobs</h4>
                            <p className="_feed_inner_post_top_para">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="_feed_inner_post_middle">
                        <p className="_feed_inner_post_middle_para">
                          Welcome to the new social network! Share your thoughts and connect with friends.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <div className="_layout_right_sidebar_wrap">
                  <div className="_layout_right_sidebar_inner">
                    <div className="_right_inner_area _padd_t24 _padd_b24 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                      <h4 className="_title5 _mar_b24">Suggested People</h4>
                      <div className="_left_inner_area_suggest_info">
                        <div className="_left_inner_area_suggest_info_box">
                          <div className="_left_inner_area_suggest_info_image">
                            <img src="assets/images/people1.png" alt="Image" className="_info_img" />
                          </div>
                          <div className="_left_inner_area_suggest_info_txt">
                            <h4 className="_left_inner_area_suggest_info_title">Steve Jobs</h4>
                            <p className="_left_inner_area_suggest_info_para">CEO of Apple</p>
                          </div>
                        </div>
                        <div className="_left_inner_area_suggest_info_link">
                          <a href="#0" className="_info_link">Connect</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
