import { useEffect, useState } from "react";

/**
 * Full-screen badge celebration popup.
 * Shown when user earns a new badge.
 */
const BadgePopup = ({ badges, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (badges && badges.length > 0) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [badges, onClose]);

  if (!show || !badges || badges.length === 0) return null;

  const badge = badges[0]; // Show one at a time

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center max-w-xs mx-4 shadow-2xl animate-bounce-in">
        <div className="text-6xl mb-4">{badge.icon}</div>
        <h2 className="text-xl font-bold text-navy-700 dark:text-white mb-2">
          {badge.name}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Bahut badhiya! New badge mili! 🎉
        </p>
        <button
          onClick={() => {
            setShow(false);
            onClose?.();
          }}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-saffron-500 to-turmeric-500 text-white font-semibold text-sm hover:shadow-lg transition-all"
        >
          Awesome! 🙌
        </button>
      </div>
    </div>
  );
};

export default BadgePopup;
