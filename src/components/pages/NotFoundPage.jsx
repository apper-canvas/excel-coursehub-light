import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="BookX" className="w-24 h-24 text-gray-300 mx-auto" />
        </motion.div>
        <Text as="h1" className="mt-6 text-4xl font-heading font-bold text-gray-900">404</Text>
        <Text as="h2" className="mt-2 text-xl font-medium text-gray-600">Page Not Found</Text>
        <Text as="p" className="mt-4 text-gray-500 max-w-md mx-auto">
          The page you're looking for doesn't exist. Let's get you back to learning!
        </Text>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/browse')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Browse Courses
          </Button>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;