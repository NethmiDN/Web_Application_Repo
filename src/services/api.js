import axios from 'axios';

// API Gateway base URL
// const GATEWAY_URL = 'http://localhost:8080';

// API Gateway base URL (GCP Load Balancer Public IP)
const GATEWAY_URL = 'http://8.233.86.133';

const client = axios.create({
  baseURL: GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// In-Memory Mock Store for offline demonstration mode
let mockUsers = [
  { id: 1, name: 'Alex Mercer', email: 'alex.mercer@example.com', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', createdAt: new Date().toISOString() },
  { id: 2, name: 'Nethmi Silva', email: 'nethmi@example.com', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', createdAt: new Date().toISOString() }
];

let mockEvents = [
  {
    id: 'evt_101',
    title: 'Ella Rock & Nine Arch Bridge Trip',
    location: 'Ella',
    country: 'Sri Lanka',
    description: 'Scenic train trip through tea plantations and lush mountain valleys in Ella.',
    tags: ['hiking', 'scenic', 'nature'],
    rating: 4.9,
    createdBy: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'evt_102',
    title: 'Mount Rainier Alpine Trekking',
    location: 'Washington',
    country: 'USA',
    description: 'Unforgettable hiking adventure with clear blue skies and snowy mountain peaks.',
    tags: ['mountain', 'adventure', 'camping'],
    rating: 4.7,
    createdBy: 2,
    createdAt: new Date().toISOString()
  }
];

let mockBlogs = [
  {
    id: 'blog_201',
    destinationId: 'evt_101',
    userId: 1,
    title: 'Ultimate Ella Travel Guide: Secret Viewpoints',
    content: 'Ella is known for its breathtaking vistas. When hiking up Ella Rock, ensure you start early at around 6:00 AM to catch the morning mist over Little Adams Peak.',
    travelTips: ['Bring sturdy hiking boots', 'Carry water bottles', 'Start early at 6 AM'],
    tags: ['guide', 'srilanka'],
    createdAt: new Date().toISOString()
  }
];

let mockReviews = [
  {
    id: 'rev_301',
    destinationId: 'evt_101',
    userId: 2,
    rating: 5,
    comment: 'Spectacular views! The train ride from Kandy to Ella is unmatched.',
    createdAt: new Date().toISOString()
  }
];

let mockFavorites = [
  { id: 1, userId: 1, destinationId: 'evt_102' }
];

let mockVisited = [
  { id: 1, userId: 1, placeName: 'Ella Gap', country: 'Sri Lanka', visitedDate: '2026-05-10' }
];

let mockPhotos = [
  {
    id: 1,
    userId: 1,
    destinationId: 'evt_101',
    photoUrl: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=600',
    fileName: 'ella_view.jpg',
    contentType: 'image/jpeg',
    uploadedAt: new Date().toISOString()
  }
];

// Helper to execute request with mock fallback if backend is offline
const safeRequest = async (requestFn, fallbackFn) => {
  try {
    const res = await requestFn();
    return res.data;
  } catch (err) {
    console.warn('[API Gateway Notice] Microservice offline or gateway unreachable. Executing mock fallback.', err.message);
    return fallbackFn();
  }
};

// Check connectivity to Gateway
export const checkGatewayStatus = async () => {
  try {
    await axios.get(`${GATEWAY_URL}/api/users`, { timeout: 2000 });
    return true;
  } catch (err) {
    return false;
  }
};

// --- USER SERVICE APIs ---
export const usersApi = {
  getUsers: async () => {
    return safeRequest(
      () => client.get('/api/users'),
      () => [...mockUsers]
    );
  },
  getUserById: async (id) => {
    return safeRequest(
      () => client.get(`/api/users/${id}`),
      () => mockUsers.find(u => u.id === Number(id)) || mockUsers[0]
    );
  },
  createUser: async (userData) => {
    return safeRequest(
      () => client.post('/api/users', userData),
      () => {
        const newUser = {
          id: Date.now(),
          ...userData,
          createdAt: new Date().toISOString()
        };
        mockUsers.push(newUser);
        return newUser;
      }
    );
  },
  updateUser: async (id, userData) => {
    return safeRequest(
      () => client.put(`/api/users/${id}`, userData),
      () => {
        const idx = mockUsers.findIndex(u => u.id === Number(id));
        if (idx !== -1) {
          mockUsers[idx] = { ...mockUsers[idx], ...userData };
          return mockUsers[idx];
        }
        return userData;
      }
    );
  },
  getFavorites: async (userId) => {
    return safeRequest(
      () => client.get(`/api/users/${userId}/favorites`),
      () => mockFavorites.filter(f => f.userId === Number(userId))
    );
  },
  addFavorite: async (userId, destinationId) => {
    return safeRequest(
      () => client.post(`/api/users/${userId}/favorites?destinationId=${destinationId}`),
      () => {
        const newFav = { id: Date.now(), userId: Number(userId), destinationId };
        mockFavorites.push(newFav);
        return newFav;
      }
    );
  },
  removeFavorite: async (favoriteId) => {
    return safeRequest(
      () => client.delete(`/api/users/favorites/${favoriteId}`),
      () => {
        mockFavorites = mockFavorites.filter(f => f.id !== Number(favoriteId));
        return true;
      }
    );
  },
  getVisitedPlaces: async (userId) => {
    return safeRequest(
      () => client.get(`/api/users/${userId}/visited`),
      () => mockVisited.filter(v => v.userId === Number(userId))
    );
  },
  addVisitedPlace: async (userId, placeData) => {
    return safeRequest(
      () => client.post(`/api/users/${userId}/visited`, placeData),
      () => {
        const newPlace = { id: Date.now(), userId: Number(userId), ...placeData };
        mockVisited.push(newPlace);
        return newPlace;
      }
    );
  },
  removeVisitedPlace: async (placeId) => {
    return safeRequest(
      () => client.delete(`/api/users/visited/${placeId}`),
      () => {
        mockVisited = mockVisited.filter(v => v.id !== Number(placeId));
        return true;
      }
    );
  }
};

// --- EVENT SERVICE APIs ---
export const eventsApi = {
  getEvents: async (tag) => {
    return safeRequest(
      () => client.get('/api/events', { params: { tag } }),
      () => {
        if (tag) {
          return mockEvents.filter(e => e.tags && e.tags.includes(tag));
        }
        return [...mockEvents];
      }
    );
  },
  getEventById: async (id) => {
    return safeRequest(
      () => client.get(`/api/events/${id}`),
      () => mockEvents.find(e => e.id === id) || mockEvents[0]
    );
  },
  createEvent: async (eventData) => {
    return safeRequest(
      () => client.post('/api/events', eventData),
      () => {
        const newEvt = {
          id: `evt_${Date.now()}`,
          rating: 0.0,
          ...eventData,
          createdAt: new Date().toISOString()
        };
        mockEvents.unshift(newEvt);
        return newEvt;
      }
    );
  },
  updateEvent: async (id, eventData) => {
    return safeRequest(
      () => client.put(`/api/events/${id}`, eventData),
      () => {
        const idx = mockEvents.findIndex(e => e.id === id);
        if (idx !== -1) {
          mockEvents[idx] = { ...mockEvents[idx], ...eventData };
          return mockEvents[idx];
        }
        return eventData;
      }
    );
  },
  deleteEvent: async (id) => {
    return safeRequest(
      () => client.delete(`/api/events/${id}`),
      () => {
        mockEvents = mockEvents.filter(e => e.id !== id);
        mockBlogs = mockBlogs.filter(b => b.destinationId !== id);
        mockReviews = mockReviews.filter(r => r.destinationId !== id);
        return true;
      }
    );
  }
};

// --- BLOG SERVICE APIs ---
export const blogsApi = {
  createBlog: async (blogData) => {
    return safeRequest(
      () => client.post('/api/blogs', blogData),
      () => {
        const newBlog = {
          id: `blog_${Date.now()}`,
          ...blogData,
          createdAt: new Date().toISOString()
        };
        mockBlogs.unshift(newBlog);
        return newBlog;
      }
    );
  },
  getBlogsByEvent: async (destinationId) => {
    return safeRequest(
      () => client.get(`/api/events/${destinationId}/blogs`),
      () => mockBlogs.filter(b => b.destinationId === destinationId)
    );
  },
  getBlogsByUser: async (userId) => {
    return safeRequest(
      () => client.get(`/api/blogs/user/${userId}`),
      () => mockBlogs.filter(b => b.userId === Number(userId))
    );
  },
  updateBlog: async (id, blogData) => {
    return safeRequest(
      () => client.put(`/api/blogs/${id}`, blogData),
      () => {
        const idx = mockBlogs.findIndex(b => b.id === id);
        if (idx !== -1) {
          mockBlogs[idx] = { ...mockBlogs[idx], ...blogData };
          return mockBlogs[idx];
        }
        return blogData;
      }
    );
  },
  deleteBlog: async (id) => {
    return safeRequest(
      () => client.delete(`/api/blogs/${id}`),
      () => {
        mockBlogs = mockBlogs.filter(b => b.id !== id);
        return true;
      }
    );
  }
};

// --- REVIEW SERVICE APIs ---
export const reviewsApi = {
  addReview: async (destinationId, reviewData) => {
    return safeRequest(
      () => client.post(`/api/events/${destinationId}/reviews`, reviewData),
      () => {
        const newRev = {
          id: `rev_${Date.now()}`,
          destinationId,
          ...reviewData,
          createdAt: new Date().toISOString()
        };
        mockReviews.push(newRev);
        // Recalculate mock event rating
        const revs = mockReviews.filter(r => r.destinationId === destinationId);
        const avg = revs.reduce((acc, r) => acc + r.rating, 0) / revs.length;
        const event = mockEvents.find(e => e.id === destinationId);
        if (event) event.rating = Number(avg.toFixed(1));
        return newRev;
      }
    );
  },
  getReviewsForEvent: async (destinationId) => {
    return safeRequest(
      () => client.get(`/api/events/${destinationId}/reviews`),
      () => mockReviews.filter(r => r.destinationId === destinationId)
    );
  },
  updateReview: async (id, reviewData) => {
    return safeRequest(
      () => client.put(`/api/reviews/${id}`, reviewData),
      () => {
        const idx = mockReviews.findIndex(r => r.id === id);
        if (idx !== -1) {
          mockReviews[idx] = { ...mockReviews[idx], ...reviewData };
          return mockReviews[idx];
        }
        return reviewData;
      }
    );
  },
  deleteReview: async (id) => {
    return safeRequest(
      () => client.delete(`/api/reviews/${id}`),
      () => {
        mockReviews = mockReviews.filter(r => r.id !== id);
        return true;
      }
    );
  }
};

// --- MEDIA SERVICE APIs ---
export const mediaApi = {
  uploadPhoto: async (file, userId, destinationId) => {
    const formData = new FormData();
    formData.append('file', file);
    if (userId) formData.append('userId', userId);
    if (destinationId) formData.append('destinationId', destinationId);

    return safeRequest(
      () => client.post('/api/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
      () => {
        const mockPhoto = {
          id: Date.now(),
          userId: userId ? Number(userId) : null,
          destinationId,
          photoUrl: URL.createObjectURL(file),
          fileName: file.name,
          contentType: file.type,
          uploadedAt: new Date().toISOString()
        };
        mockPhotos.unshift(mockPhoto);
        return mockPhoto;
      }
    );
  },
  getPhotosByUser: async (userId) => {
    return safeRequest(
      () => client.get(`/api/media/user/${userId}`),
      () => mockPhotos.filter(p => p.userId === Number(userId))
    );
  },
  getPhotosByEvent: async (destinationId) => {
    return safeRequest(
      () => client.get(`/api/media/event/${destinationId}`),
      () => mockPhotos.filter(p => p.destinationId === destinationId)
    );
  }
};
