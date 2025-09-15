import { BookOpen, Twitter, Instagram, Facebook, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-kerala-green-900 text-cream-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-marigold-500 to-marigold-600 p-2 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Eluppam എളുപ്പം</span>
            </div>
            <p className="text-kerala-green-200 text-base">
              Master Malayalam with interactive lessons, cultural insights, and personalized progress tracking.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-kerala-green-200 hover:text-white">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-kerala-green-200 hover:text-white">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-kerala-green-200 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-kerala-green-200 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-marigold-300 tracking-wider uppercase">Learn</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#learn" className="text-base text-kerala-green-200 hover:text-white">Alphabet</a></li>
                  <li><a href="#practice" className="text-base text-kerala-green-200 hover:text-white">Vocabulary</a></li>
                  <li><a href="#practice" className="text-base text-kerala-green-200 hover:text-white">Grammar</a></li>
                  <li><a href="#practice" className="text-base text-kerala-green-200 hover:text-white">Conversation</a></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-marigold-300 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-kerala-green-200 hover:text-white">About</a></li>
                  <li><a href="#" className="text-base text-kerala-green-200 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-base text-kerala-green-200 hover:text-white">Careers</a></li>
                  <li><a href="#" className="text-base text-kerala-green-200 hover:text-white">Press</a></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-marigold-300 tracking-wider uppercase">
                  Subscribe to our newsletter
                </h3>
                <p className="mt-4 text-base text-kerala-green-200">
                  The latest news, articles, and resources, sent to your inbox weekly.
                </p>
                <form className="mt-4 sm:flex sm:max-w-md">
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <input
                    type="email"
                    name="email-address"
                    id="email-address"
                    autoComplete="email"
                    required
                    className="appearance-none min-w-0 w-full bg-white border border-transparent rounded-md py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-kerala-green-900 focus:ring-white focus:border-white focus:placeholder-gray-400"
                    placeholder="Enter your email"
                  />
                  <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                    <button
                      type="submit"
                      className="w-full bg-marigold-500 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-marigold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-kerala-green-900 focus:ring-marigold-500"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
              <div className="mt-12 md:mt-8">
                <h3 className="text-sm font-semibold text-marigold-300 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-kerala-green-200 hover:text-white">Privacy</a></li>
                  <li><a href="#" className="text-base text-kerala-green-200 hover:text-white">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-kerala-green-800 pt-8">
          <p className="text-base text-kerala-green-300 xl:text-center">&copy; {new Date().getFullYear()} Eluppam എളുപ്പം. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
