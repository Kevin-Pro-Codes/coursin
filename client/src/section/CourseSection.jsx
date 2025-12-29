import { useState, useEffect, useMemo, useCallback } from 'react';

const CourseSection = ({ courses: propCourses = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');

  // Use propCourses if provided, otherwise use default courses
  const defaultCourses = useMemo(() => [
    { 
      id: 1, 
      title: "React Fundamentals", 
      description: "Master React basics with hands-on projects and build modern web applications", 
      duration: "6 weeks", 
      level: "Beginner", 
      price: "$199",
      category: "Web Development",
      instructor: "Alex Johnson",
      rating: 4.8,
      students: 12450,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 2, 
      title: "Advanced JavaScript", 
      description: "Deep dive into modern JavaScript patterns, async programming, and performance optimization", 
      duration: "8 weeks", 
      level: "Intermediate", 
      price: "$249",
      category: "Programming",
      instructor: "Maria Chen",
      rating: 4.9,
      students: 8920,
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 3, 
      title: "Full-Stack Development", 
      description: "Build complete web applications with Node.js, Express, MongoDB and React", 
      duration: "12 weeks", 
      level: "Advanced", 
      price: "$399",
      category: "Web Development",
      instructor: "David Wilson",
      rating: 4.7,
      students: 15680,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 4, 
      title: "UI/UX Design Principles", 
      description: "Learn to create user-centered designs with Figma and modern design systems", 
      duration: "5 weeks", 
      level: "Beginner", 
      price: "$179",
      category: "Design",
      instructor: "Sarah Miller",
      rating: 4.6,
      students: 10340,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 5, 
      title: "Data Structures & Algorithms", 
      description: "Essential computer science concepts for technical interviews and efficient coding", 
      duration: "10 weeks", 
      level: "Intermediate", 
      price: "$299",
      category: "Computer Science",
      instructor: "Robert Kim",
      rating: 4.9,
      students: 21300,
      image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 6, 
      title: "Cloud Computing with AWS", 
      description: "Deploy, scale and manage applications on Amazon Web Services infrastructure", 
      duration: "7 weeks", 
      level: "Advanced", 
      price: "$349",
      category: "Cloud",
      instructor: "James Anderson",
      rating: 4.8,
      students: 9870,
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 7, 
      title: "Python for Data Science", 
      description: "Master Python libraries like Pandas, NumPy, and Matplotlib for data analysis", 
      duration: "9 weeks", 
      level: "Intermediate", 
      price: "$279",
      category: "Data Science",
      instructor: "Lisa Wang",
      rating: 4.7,
      students: 18760,
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 8, 
      title: "Mobile App Development with React Native", 
      description: "Build cross-platform mobile applications for iOS and Android using React Native", 
      duration: "8 weeks", 
      level: "Intermediate", 
      price: "$299",
      category: "Mobile Development",
      instructor: "Michael Brown",
      rating: 4.6,
      students: 11230,
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 9, 
      title: "Machine Learning Fundamentals", 
      description: "Introduction to ML algorithms, model training, and evaluation techniques", 
      duration: "11 weeks", 
      level: "Advanced", 
      price: "$399",
      category: "AI & ML",
      instructor: "Dr. Emily Zhang",
      rating: 4.9,
      students: 15640,
      image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 10, 
      title: "DevOps & CI/CD", 
      description: "Master continuous integration and deployment with Docker, Jenkins, and Kubernetes", 
      duration: "7 weeks", 
      level: "Intermediate", 
      price: "$329",
      category: "DevOps",
      instructor: "Chris Taylor",
      rating: 4.7,
      students: 8760,
      image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 11, 
      title: "Cybersecurity Essentials", 
      description: "Learn security fundamentals, threat detection, and network protection strategies", 
      duration: "6 weeks", 
      level: "Beginner", 
      price: "$229",
      category: "Security",
      instructor: "Mark Thompson",
      rating: 4.8,
      students: 14320,
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 12, 
      title: "Digital Marketing Strategy", 
      description: "Develop effective digital marketing campaigns and analyze performance metrics", 
      duration: "5 weeks", 
      level: "Beginner", 
      price: "$189",
      category: "Marketing",
      instructor: "Jessica Lee",
      rating: 4.5,
      students: 9560,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 13, 
      title: "Blockchain Development", 
      description: "Build decentralized applications using Ethereum and Smart Contracts", 
      duration: "10 weeks", 
      level: "Advanced", 
      price: "$449",
      category: "Blockchain",
      instructor: "Ryan Cooper",
      rating: 4.8,
      students: 6780,
      image: "https://images.unsplash.com/photo-1620336655055-bd87c5d1d73f?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 14, 
      title: "Game Development with Unity", 
      description: "Create 2D and 3D games using Unity game engine and C# programming", 
      duration: "9 weeks", 
      level: "Intermediate", 
      price: "$279",
      category: "Game Development",
      instructor: "Kevin Martinez",
      rating: 4.6,
      students: 7650,
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 15, 
      title: "iOS App Development with Swift", 
      description: "Build native iOS applications using Swift and Xcode for Apple devices", 
      duration: "8 weeks", 
      level: "Intermediate", 
      price: "$299",
      category: "Mobile Development",
      instructor: "Sophia Garcia",
      rating: 4.7,
      students: 9230,
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 16, 
      title: "Android Development with Kotlin", 
      description: "Create Android apps using Kotlin and modern Android development practices", 
      duration: "9 weeks", 
      level: "Intermediate", 
      price: "$289",
      category: "Mobile Development",
      instructor: "Daniel Park",
      rating: 4.7,
      students: 8450,
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 17, 
      title: "Database Design & SQL", 
      description: "Master relational database design, SQL queries, and optimization techniques", 
      duration: "7 weeks", 
      level: "Beginner", 
      price: "$219",
      category: "Databases",
      instructor: "Brian Wilson",
      rating: 4.6,
      students: 13200,
      image: "https://images.unsplash.com/photo-1543949806-2c9935e6aa78?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 18, 
      title: "Graphic Design Fundamentals", 
      description: "Learn design principles, color theory, and typography with Adobe Creative Suite", 
      duration: "6 weeks", 
      level: "Beginner", 
      price: "$199",
      category: "Design",
      instructor: "Olivia White",
      rating: 4.5,
      students: 11240,
      image: "https://images.unsplash.com/photo-1561070791-4c9b95a9e2a9?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 19, 
      title: "TensorFlow for Deep Learning", 
      description: "Advanced deep learning techniques using TensorFlow and neural networks", 
      duration: "10 weeks", 
      level: "Advanced", 
      price: "$429",
      category: "AI & ML",
      instructor: "Dr. Samuel Rodriguez",
      rating: 4.9,
      students: 6780,
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 20, 
      title: "Project Management Professional", 
      description: "Prepare for PMP certification and master agile and waterfall methodologies", 
      duration: "8 weeks", 
      level: "Intermediate", 
      price: "$349",
      category: "Business",
      instructor: "Patricia Lewis",
      rating: 4.7,
      students: 15430,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 21, 
      title: "Web Accessibility Fundamentals", 
      description: "Create inclusive websites that work for everyone, including people with disabilities", 
      duration: "4 weeks", 
      level: "Beginner", 
      price: "$159",
      category: "Web Development",
      instructor: "Emma Davis",
      rating: 4.6,
      students: 8760,
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 22, 
      title: "Node.js Backend Development", 
      description: "Build scalable server-side applications with Node.js, Express, and REST APIs", 
      duration: "7 weeks", 
      level: "Intermediate", 
      price: "$279",
      category: "Web Development",
      instructor: "Thomas Harris",
      rating: 4.8,
      students: 10450,
      image: "https://images.unsplash.com/photo-1623282033815-40b05d96c903?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 23, 
      title: "TypeScript for Enterprise Applications", 
      description: "Master TypeScript for building robust, scalable applications with type safety", 
      duration: "5 weeks", 
      level: "Intermediate", 
      price: "$229",
      category: "Programming",
      instructor: "Jennifer Clark",
      rating: 4.7,
      students: 9230,
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 24, 
      title: "Product Management Fundamentals", 
      description: "Learn product lifecycle, user research, and product strategy development", 
      duration: "6 weeks", 
      level: "Beginner", 
      price: "$249",
      category: "Business",
      instructor: "Richard Moore",
      rating: 4.6,
      students: 13450,
      image: "https://images.unsplash.com/photo-1551836026-d5c2c0b4d5c1?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 25, 
      title: "Vue.js Complete Guide", 
      description: "Build modern web applications with Vue.js, Vuex, and Vue Router", 
      duration: "7 weeks", 
      level: "Intermediate", 
      price: "$269",
      category: "Web Development",
      instructor: "Andrew Taylor",
      rating: 4.8,
      students: 7650,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 26, 
      title: "Ethical Hacking & Penetration Testing", 
      description: "Learn security testing methodologies to identify and fix vulnerabilities", 
      duration: "9 weeks", 
      level: "Advanced", 
      price: "$399",
      category: "Security",
      instructor: "Jason Miller",
      rating: 4.9,
      students: 6540,
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 27, 
      title: "Angular Framework Mastery", 
      description: "Build enterprise applications with Angular, RxJS, and NgRx", 
      duration: "8 weeks", 
      level: "Intermediate", 
      price: "$289",
      category: "Web Development",
      instructor: "Steven Walker",
      rating: 4.7,
      students: 8920,
      image: "https://images.unsplash.com/photo-1599508704512-2f292ef7c6c1?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 28, 
      title: "Docker & Containerization", 
      description: "Master container technology with Docker, Docker Compose, and container orchestration", 
      duration: "5 weeks", 
      level: "Intermediate", 
      price: "$239",
      category: "DevOps",
      instructor: "Benjamin Young",
      rating: 4.8,
      students: 11230,
      image: "https://images.unsplash.com/photo-1626379953823-b311cadc6f8d?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 29, 
      title: "REST API Design & Development", 
      description: "Design, build, and document scalable RESTful APIs with best practices", 
      duration: "6 weeks", 
      level: "Intermediate", 
      price: "$259",
      category: "Web Development",
      instructor: "Michelle Adams",
      rating: 4.7,
      students: 9870,
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=60"
    },
    { 
      id: 30, 
      title: "Business Analytics with Excel & Power BI", 
      description: "Transform data into insights with advanced Excel functions and Power BI visualization", 
      duration: "5 weeks", 
      level: "Beginner", 
      price: "$199",
      category: "Data Analytics",
      instructor: "Rachel Scott",
      rating: 4.6,
      students: 18760,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60"
    }
  ], []);

  const courses = propCourses.length > 0 ? propCourses : defaultCourses;

  // Get unique categories for dropdown
  const categories = ['All Categories', ...new Set(courses.map(course => course.category))];
  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

  // Calculate filtered courses directly without separate state
  const filteredCourses = useMemo(() => {
    let result = courses;

    // Filter by search query
    if (searchQuery.trim() !== '') {
      result = result.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All Categories') {
      result = result.filter(course => course.category === selectedCategory);
    }

    // Filter by level
    if (selectedLevel !== 'All Levels') {
      result = result.filter(course => course.level === selectedLevel);
    }

    return result;
  }, [searchQuery, selectedCategory, selectedLevel, courses]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setSelectedCategory(e.target.value);
  }, []);

  const handleLevelChange = useCallback((e) => {
    setSelectedLevel(e.target.value);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedLevel('All Levels');
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return (
    <section id="courses" className="py-16 px-6 bg-gray-50 border-b-2 border-black">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">
            Explore Our Courses
          </h2>
          <p className="text-gray-800 max-w-2xl mx-auto">
            Find the perfect course to advance your career. Search by keyword, filter by category or level.
          </p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="mb-12 bg-white p-6 rounded-2xl shadow-lg border-2 border-black">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search courses by title, description, or instructor..."
                  className="w-full p-3 pl-12 bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <div className="absolute left-4 top-3.5 text-black">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-3 text-black hover:text-gray-700"
                    type="button"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full p-3 bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Level Filter */}
            <div>
              <select
                value={selectedLevel}
                onChange={handleLevelChange}
                className="w-full p-3 bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
          
        {/* Results and Clear Filters */}
<div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t-2 border-black">              
  <div className="mb-4 sm:mb-0">
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Popular searches:</span>
      <div className="flex flex-wrap gap-2">
        {['React', 'JavaScript', 'Python', 'Web Development', 'Data Science'].map((tag) => (
          <button
            key={tag}
            onClick={() => setSearchQuery(tag)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-all duration-300 border border-gray-300"
            type="button"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  </div>
  
  <div className="flex items-center space-x-4">
    {(searchQuery || selectedCategory !== 'All Categories' || selectedLevel !== 'All Levels') && (
      <button
        onClick={handleClearFilters}
        className="px-4 py-2 text-sm bg-white hover:bg-gray-100 border-2 border-black rounded-lg transition-all duration-300"
        type="button"
      >
        Clear All Filters
      </button>
    )}
  </div>
</div>
        </div>
        
        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-black">
              <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-black">No Courses Found</h3>
            <p className="text-gray-700 max-w-md mx-auto mb-8">
              We couldn't find any courses matching your search. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition-all duration-300 font-medium border-2 border-black"
              type="button"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map(course => (
                <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-black">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60`;
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-black/80 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white">
                        {course.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-black text-white rounded-full text-sm font-bold border border-white">
                        {course.price}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-black">{course.title}</h3>
                      <span className="px-3 py-1 bg-gray-100 text-black rounded-full text-sm font-medium border border-black">
                        {course.level}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4 text-sm">{course.description}</p>
                    
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-500 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-700 text-sm">{course.rating} ({course.students.toLocaleString()} students)</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-gray-800 mb-6">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{course.duration}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <svg className="w-5 h-5 mr-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span className="text-black">{course.instructor}</span>
                      </div>
                    </div>
                    
                    <button className="w-full py-3 rounded-lg bg-black hover:bg-gray-800 text-white transition-all duration-300 font-medium border-2 border-black">
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredCourses.length > 0 && (
              <div className="text-center mt-12">
                <button className="px-8 py-3 rounded-lg bg-black hover:bg-gray-800 text-white transition-all duration-300 font-medium shadow-lg border-2 border-black">
                  Load More Courses
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default CourseSection;