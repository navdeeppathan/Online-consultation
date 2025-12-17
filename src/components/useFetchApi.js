import { useEffect, useState } from "react";
import axios from "axios";
import Config from "../config";

export default function useFetchApi(path, userId = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!path) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        let url = `${Config.BASE_URL}/api/${path}`;
        if (userId) {
          url += `/${userId}`;
        }

        const response = await axios.get(url);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [path, userId]);

  return { data, loading, error };
}
