import { useEffect, useRef } from "react";

const useInfiniteScroll = ({ loading, hasMore, onLoadMore }) => {
  const observer = useRef();
  const lastElementRef = useRef();

  useEffect(() => {
    if (loading) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });

    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasMore, onLoadMore]);

  return { lastElementRef };
};

export default useInfiniteScroll;
