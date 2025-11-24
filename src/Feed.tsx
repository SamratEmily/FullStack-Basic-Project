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
  const [darkMode, setDarkMode] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const layoutRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPosts();
    fetchCurrentUser();
  }, []);

  // Handle dark mode toggle
  useEffect(() => {
    if (layoutRef.current) {
      if (darkMode) {
        layoutRef.current.classList.add('_dark_wrapper');
      } else {
        layoutRef.current.classList.remove('_dark_wrapper');
      }
    }
  }, [darkMode]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showProfileDropdown && !target.closest('._header_nav_profile')) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

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
        setPosts(response.posts as Post[]);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      const response = await api.createPost(newPostContent);
      if (response.success && response.post) {
        setPosts([response.post as Post, ...posts]);
        setNewPostContent('');
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Always logout on frontend even if API call fails
      onLogout();
    }
  };

  return (
    <div ref={layoutRef} className="_layout _layout_main_wrapper">
      {/* Theme Switcher */}
      <div className="_layout_mode_swithing_btn">
        <button 
          type="button" 
          className="_layout_swithing_btn_link"
          onClick={() => setDarkMode(!darkMode)}
        >
          <div className="_layout_swithing_btn">
            <div className="_layout_swithing_btn_round"></div>
          </div>
          <div className="_layout_change_btn_ic1">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" fill="none" viewBox="0 0 11 16">
              <path fill="#fff" d="M2.727 14.977l.04-.498-.04.498zm-1.72-.49l.489-.11-.489.11zM3.232 1.212L3.514.8l-.282.413zM9.792 8a6.5 6.5 0 00-6.5-6.5v-1a7.5 7.5 0 017.5 7.5h-1zm-6.5 6.5a6.5 6.5 0 006.5-6.5h1a7.5 7.5 0 01-7.5 7.5v-1zm-.525-.02c.173.013.348.02.525.02v1c-.204 0-.405-.008-.605-.024l.08-.997zm-.261-1.83A6.498 6.498 0 005.792 7h1a7.498 7.498 0 01-3.791 6.52l-.495-.87zM5.792 7a6.493 6.493 0 00-2.841-5.374L3.514.8A7.493 7.493 0 016.792 7h-1zm-3.105 8.476c-.528-.042-.985-.077-1.314-.155-.316-.075-.746-.242-.854-.726l.977-.217c-.028-.124-.145-.09.106-.03.237.056.6.086 1.165.131l-.08.997zm.314-1.956c-.622.354-1.045.596-1.31.792a.967.967 0 00-.204.185c-.01.013.027-.038.009-.12l-.977.218a.836.836 0 01.144-.666c.112-.162.27-.3.433-.42.324-.24.814-.519 1.41-.858L3 13.52zM3.292 1.5a.391.391 0 00.374-.285A.382.382 0 003.514.8l-.563.826A.618.618 0 012.702.95a.609.609 0 01.59-.45v1z"/>
            </svg>
          </div>
          <div className="_layout_change_btn_ic2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4.389" stroke="#fff" transform="rotate(-90 12 12)"/>
              <path stroke="#fff" strokeLinecap="round" d="M3.444 12H1M23 12h-2.444M5.95 5.95L4.222 4.22M19.778 19.779L18.05 18.05M12 3.444V1M12 23v-2.445M18.05 5.95l1.728-1.729M4.222 19.779L5.95 18.05"/>
            </svg>
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
                  <p className="_header_nav_para">
                    {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Loading...'}
                  </p>
                  <button 
                    id="_profile_drop_show_btn"
                    className="_header_nav_dropdown_btn _dropdown_toggle" 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowProfileDropdown(!showProfileDropdown);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" fill="none" viewBox="0 0 10 6">
                      <path fill="#112032" d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z" />
                    </svg>
                  </button>
                </div>
                
                <div 
                  id="_prfoile_drop"
                  className={`_nav_profile_dropdown _profile_dropdown ${showProfileDropdown ? 'show' : ''}`}
                >
                    <div className="_nav_profile_dropdown_info">
                      <div className="_nav_profile_dropdown_image">
                        <img src="assets/images/profile.png" alt="Image" className="_nav_drop_img" />
                      </div>
                      <div className="_nav_profile_dropdown_info_txt">
                        <h4 className="_nav_dropdown_title">
                          {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Loading...'}
                        </h4>
                        <a href="#0" className="_nav_drop_profile">View Profile</a>
                      </div>
                    </div>
                    <hr />
                    <ul className="_nav_dropdown_list">
                      <li className="_nav_dropdown_list_item">
                      <a href="#0" className="_nav_dropdown_link">
                        <div className="_nav_drop_info">
                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" fill="none" viewBox="0 0 18 19">
                              <path fill="#377DFF" d="M9.584 0c.671 0 1.315.267 1.783.74.468.473.721 1.112.7 1.709l.009.14a.985.985 0 00.136.395c.145.242.382.418.659.488.276.071.57.03.849-.13l.155-.078c1.165-.538 2.563-.11 3.21.991l.58.99a.695.695 0 01.04.081l.055.107c.519 1.089.15 2.385-.838 3.043l-.244.15a1.046 1.046 0 00-.313.339 1.042 1.042 0 00-.11.805c.074.272.255.504.53.66l.158.1c.478.328.823.812.973 1.367.17.626.08 1.292-.257 1.86l-.625 1.022-.094.144c-.735 1.038-2.16 1.355-3.248.738l-.129-.066a1.123 1.123 0 00-.412-.095 1.087 1.087 0 00-.766.31c-.204.2-.317.471-.316.786l-.008.163C11.956 18.022 10.88 19 9.584 19h-1.17c-1.373 0-2.486-1.093-2.484-2.398l-.008-.14a.994.994 0 00-.14-.401 1.066 1.066 0 00-.652-.493 1.12 1.12 0 00-.852.127l-.169.083a2.526 2.526 0 01-1.698.122 2.47 2.47 0 01-1.488-1.154l-.604-1.024-.08-.152a2.404 2.404 0 01.975-3.132l.1-.061c.292-.199.467-.527.467-.877 0-.381-.207-.733-.569-.94l-.147-.092a2.419 2.419 0 01-.724-3.236l.615-.993a2.503 2.503 0 013.366-.912l.126.066c.13.058.269.089.403.09a1.08 1.08 0 001.086-1.068l.008-.185c.049-.57.301-1.106.713-1.513A2.5 2.5 0 018.414 0h1.17zm0 1.375h-1.17c-.287 0-.562.113-.764.312-.179.177-.288.41-.308.628l-.012.29c-.098 1.262-1.172 2.253-2.486 2.253a2.475 2.475 0 01-1.013-.231l-.182-.095a1.1 1.1 0 00-1.488.407l-.616.993a1.05 1.05 0 00.296 1.392l.247.153A2.43 2.43 0 013.181 9.5c0 .802-.401 1.552-1.095 2.023l-.147.091c-.486.276-.674.873-.448 1.342l.053.102.597 1.01c.14.248.374.431.652.509.246.069.51.05.714-.04l.103-.05a2.506 2.506 0 011.882-.248 2.456 2.456 0 011.823 2.1l.02.335c.059.535.52.95 1.079.95h1.17c.566 0 1.036-.427 1.08-.95l.005-.104a2.412 2.412 0 01.726-1.732 2.508 2.508 0 011.779-.713c.331.009.658.082.992.23l.3.15c.469.202 1.026.054 1.309-.344l.068-.105.61-1a1.045 1.045 0 00-.288-1.383l-.257-.16a2.435 2.435 0 01-1.006-1.389 2.393 2.393 0 01.25-1.847c.181-.31.429-.575.752-.795l.152-.095c.485-.278.672-.875.448-1.346l-.067-.127-.012-.027-.554-.945a1.095 1.095 0 00-1.27-.487l-.105.041-.098.049a2.515 2.515 0 01-1.88.259 2.47 2.47 0 01-1.511-1.122 2.367 2.367 0 01-.325-.97l-.012-.24a1.056 1.056 0 00-.307-.774 1.096 1.096 0 00-.779-.323zm-.58 5.02c1.744 0 3.16 1.39 3.16 3.105s-1.416 3.105-3.16 3.105c-1.746 0-3.161-1.39-3.161-3.105s1.415-3.105 3.16-3.105zm0 1.376c-.973 0-1.761.774-1.761 1.729 0 .955.788 1.73 1.76 1.73s1.76-.775 1.76-1.73-.788-1.73-1.76-1.73z"/>
                              </svg>											  
                          </span>
                          Settings		
                        </div>
                        <button type="submit" className="_nav_drop_btn_link">
                          <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" fill="none" viewBox="0 0 6 10">
                            <path fill="#112032" d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z" opacity=".5"/>
                          </svg>												  
                        </button>
                      </a>
                    </li>
                    <li className="_nav_dropdown_list_item">
                      <a href="#0" className="_nav_dropdown_link">
                        <div className="_nav_drop_info">
                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                              <path stroke="#377DFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19a9 9 0 100-18 9 9 0 000 18z"/>
                              <path stroke="#377DFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7.38 7.3a2.7 2.7 0 015.248.9c0 1.8-2.7 2.7-2.7 2.7M10 14.5h.009"/>
                            </svg>												
                          </span>
                          Help & Support		
                        </div>
                        <button type="submit" className="_nav_drop_btn_link">
                          <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" fill="none" viewBox="0 0 6 10">
                            <path fill="#112032" d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z" opacity=".5"/>
                          </svg>												  
                        </button>
                      </a>
                    </li>
                      <li className="_nav_dropdown_list_item">
                        <a 
                          href="#0" 
                          className="_nav_dropdown_link" 
                          onClick={(e) => { 
                            e.preventDefault(); 
                            e.stopPropagation();
                            setShowProfileDropdown(false);
                            handleLogout(); 
                          }}
                        >
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
