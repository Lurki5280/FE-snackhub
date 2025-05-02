import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAllCategories } from "../api/categories";
import SnackList from "./SnackList";

const CategoryDetailScreen = () => {
    const { id } = useParams();
    const [categoryName, setCategoryName] = useState("");
    const [categoryCode, setCategoryCode] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchCategoryName = async () => {
        try {
          setLoading(true);
          const response = await getAllCategories();
          const category = response.data.find(
            (cat) => String(cat.categoryId) === String(id)
          );
          if (category) {
            setCategoryName(category.categoryName);
            setCategoryCode(category.categoryId); 
          } else {
            setCategoryName("Không tìm thấy danh mục");
          }
        } catch (error) {
          console.error("Lỗi khi tải danh mục:", error);
          setCategoryName("Đã xảy ra lỗi khi tải danh mục");
        } finally {
          setLoading(false);
        }
      };
    
      if (id) {
        fetchCategoryName();
      }
    }, [id]);    
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-black-800 mb-4">
        {loading ? "Đang tải..." : categoryName}
      </h1>
      <SnackList categoryId={categoryCode} />
    </div>
  );
};

export default CategoryDetailScreen;
