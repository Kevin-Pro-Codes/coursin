function Footer() {
  return (
    <footer className="bg-white border-t-2 border-black py-12 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 bg-black rounded-lg flex items-center justify-center font-bold text-lg text-white border-2 border-black">
                C
              </div>
              <span className="text-2xl font-bold text-black">
                CourseMaster
              </span>
            </div>
            <p className="text-gray-700">
              Empowering the next generation of developers, designers, and tech professionals through high-quality, accessible education.
            </p>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-6 text-black">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-700 hover:text-black transition-colors">Home</a></li>
              <li><a href="#courses" className="text-gray-700 hover:text-black transition-colors">All Courses</a></li>
              <li><a href="#features" className="text-gray-700 hover:text-black transition-colors">Features</a></li>
              <li><a href="#contact" className="text-gray-700 hover:text-black transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-6 text-black">Top Categories</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-700 hover:text-black transition-colors">Web Development</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black transition-colors">Data Science</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black transition-colors">Mobile Development</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black transition-colors">UI/UX Design</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black transition-colors">AI & Machine Learning</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-6 text-black">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                support@coursemaster.com
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                123 Learning St, Tech City
              </li>
            </ul>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-black transition-colors border-2 border-black">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-black transition-colors border-2 border-black">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-black transition-colors border-2 border-black">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t-2 border-black mt-10 pt-8 text-center text-gray-700">
          <p>&copy; {new Date().getFullYear()} CourseMaster. All rights reserved. | <a href="#" className="hover:text-black">Privacy Policy</a> | <a href="#" className="hover:text-black">Terms of Service</a></p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;