import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegCircleXmark } from "react-icons/fa6";

const AdPoster = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 10000); // Tự đóng sau 10s
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            className="relative w-[90%] max-w-md bg-white rounded-xl shadow-xl overflow-hidden"
          >
            <button
              onClick={() => setShow(false)}
              className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full z-10"
            >
              <FaRegCircleXmark className="w-4 h-4" />
            </button>
            <img
              src="../assets/ad.png"
              alt="Ad Poster"
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdPoster;
