"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CategoryRequestInfo } from "@/types";
import {
  getPendingCategoryRequests,
  approveCategoryRequest,
  rejectCategoryRequest,
} from "@/lib/api";

export default function AdminPage() {
  const router = useRouter();
  const { isLoggedIn, isAdmin } = useAuth();
  const [requests, setRequests] = useState<CategoryRequestInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      router.replace("/");
      return;
    }
    loadRequests();
  }, [isLoggedIn, isAdmin, router]);

  const loadRequests = async () => {
    try {
      const data = await getPendingCategoryRequests();
      setRequests(data);
    } catch (error) {
      console.error("Failed to load requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await approveCategoryRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Failed to approve:", error);
      alert("승인에 실패했습니다.");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectCategoryRequest(id, rejectReason);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      setRejectingId(null);
      setRejectReason("");
    } catch (error) {
      console.error("Failed to reject:", error);
      alert("거절에 실패했습니다.");
    }
  };

  if (!isLoggedIn || !isAdmin) return null;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">카테고리 요청 관리</h1>

      {requests.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          대기 중인 요청이 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="border border-gray-200 rounded-lg p-5 bg-white"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-lg">{req.label}</span>
                    <span className="text-sm text-gray-500">({req.name})</span>
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ backgroundColor: req.color }}
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    요청자: {req.requesterNickname} | {new Date(req.createdAt).toLocaleDateString("ko-KR")}
                  </div>
                </div>
                <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  대기중
                </span>
              </div>

              {rejectingId === req.id ? (
                <div className="mt-4 space-y-2">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="거절 사유를 입력하세요"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(req.id)}
                      className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      거절 확인
                    </button>
                    <button
                      onClick={() => {
                        setRejectingId(null);
                        setRejectReason("");
                      }}
                      className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleApprove(req.id)}
                    className="px-4 py-1.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                  >
                    승인
                  </button>
                  <button
                    onClick={() => setRejectingId(req.id)}
                    className="px-4 py-1.5 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    거절
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
