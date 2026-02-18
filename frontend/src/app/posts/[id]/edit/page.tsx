"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPost, getCategories, updatePost, IMAGE_BASE_URL } from "@/lib/api";
import { CategoryInfo } from "@/types";
import { useAuth } from "@/context/AuthContext";
import CategoryRequestModal from "@/components/CategoryRequestModal";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params.id);
  const { isLoggedIn, nickname } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryInfo[]>([
    { id: 0, name: "HUMOR", label: "유머", color: "yellow" },
    { id: 0, name: "NEWS", label: "시사", color: "blue" },
    { id: 0, name: "DOG", label: "강아지", color: "orange" },
    { id: 0, name: "CAT", label: "고양이", color: "purple" },
    { id: 0, name: "CHAT", label: "잡담", color: "green" },
  ]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    getCategories()
      .then((cats) => {
        if (cats.length > 0) setCategories(cats);
      })
      .catch(console.error);

    getPost(postId)
      .then((post) => {
        if (post.authorNickname !== nickname) {
          alert("본인이 작성한 글만 수정할 수 있습니다.");
          router.replace(`/posts/${postId}`);
          return;
        }
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category);
        if (post.imageUrl) {
          setImagePreview(`${IMAGE_BASE_URL}${post.imageUrl}`);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId, isLoggedIn, nickname, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content.trim());
      formData.append("category", category);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await updatePost(postId, formData);
      router.push(`/posts/${postId}`);
    } catch (error) {
      console.error("Failed to update post:", error);
      alert("게시글 수정에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoggedIn) return null;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-orange-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">글 수정</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            카테고리
          </label>
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowCategoryModal(true)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              + 요청
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이미지 (선택)
          </label>
          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
          {imagePreview && (
            <div className="mt-3 w-full max-w-sm rounded-xl overflow-hidden">
              <img
                src={imagePreview}
                alt="미리보기"
                className="w-full rounded-xl object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting || !title.trim() || !content.trim()}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "수정 중..." : "수정하기"}
          </button>
        </div>
      </form>

      {showCategoryModal && (
        <CategoryRequestModal onClose={() => setShowCategoryModal(false)} />
      )}
    </div>
  );
}
