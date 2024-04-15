"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "@/firebase";
import Moment from "react-moment";

const CommentSection = ({ id }) => {
  const [comment, setComment] = useState("");
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const db = getFirestore(app);

  async function handleSubmit(e) {
    e.preventDefault();
    const commentToPost = comment;
    setComment("");
    await addDoc(collection(db, "posts", id, "comments"), {
      comment: commentToPost,
      username: session?.user?.username,
      userImage: session?.user?.image,
      timestamp: serverTimestamp(),
    });
  }

  useEffect(() => {
    onSnapshot(query(collection(db, "posts", id, "comments")), (snapshot) => {
      setComments(snapshot.docs);
    });
  }, [db]);

  return (
    <div>
      {comments.length > 0 && (
        <div className="p-2 mx-10 max-h-24 overflow-y-scroll ">
          {comments.map((comment, id) => (
            <div key={id} className="flex items-center space-x-2 mb-2">
              <img
                src={comment.data().userImage}
                alt="UserImage"
                className="h-7 rounded-full object-cover border p-[2px]"
              />
              <p className="text-sm">
                <span className="font-bold text-gray-700">
                  {comment.data().username}
                </span>
                {comment.data().comment}
              </p>
              <Moment fromNow className="text-xs text-gray-400">
                {comment.data().timestamp?.toDate()}
              </Moment>
            </div>
          ))}
        </div>
      )}
      {session && (
        <form onSubmit={handleSubmit} className="flex items-center p-4">
          <img
            src={session.user.image}
            alt="User Image"
            className="h-10 w-10 rounded-full border p-[4px] object-cover"
          />
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
            className="border-none flex-1 focus:ring-0 outline-none"
          />
          <button
            disabled={!comment.trim()}
            type="submit"
            className="font-semibold text-blue-400 disabled:cursor-not-allowed disabled:text-gray-400"
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;
