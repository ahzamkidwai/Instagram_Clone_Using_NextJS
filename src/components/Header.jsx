"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Modal from "react-modal";
import { IoIosAddCircleOutline } from "react-icons/io";
import { HiCamera } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { app } from "@/firebase";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import {
  Timestamp,
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { CiSearch } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";

const Header = () => {
  const { data: session } = useSession();
  console.log("Session is : ", session);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [postUploading, setPostUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const filePickerRef = useRef(null);
  const db = getFirestore(app);

  console.log("ImageFileUrl is : ", imageFileUrl);
  console.log("Selected File is : ", selectedFile);
  console.log("Session is (inside Header.jsx) : ", session);

  function addImageToPost(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

  async function uploadImageToStorage() {
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + selectedFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("upload is : " + progress + " done");
      },
      (error) => {
        console.log("Error is : ", error);
        setImageFileUploading(false);
        setImageFileUrl(null);
        setSelectedFile(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setImageFileUploading(false);
        });
      }
    );
  }

  async function handleSubmit() {
    setPostUploading(true);
    const docRef = await addDoc(collection(db, "posts"), {
      username: session.user.username,
      caption: caption,
      profileImg: session.user.image,
      image: imageFileUrl,
      timestamp: serverTimestamp(),
    });
    setPostUploading(false);
    setIsOpen(false);
    location.reload();
  }

  function capitalizeName(name) {
    const words = name.toLowerCase().split(" ");
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    const capitalizedName = capitalizedWords.join(" ");
    return capitalizedName;
  }

  useEffect(() => {
    if (selectedFile) {
      uploadImageToStorage();
    }
  }, [selectedFile]);

  return (
    <div className=" shadow-sm border-b stciky top-0 bg-white z-30 p-3">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center">
          <Link href="/" className="hidden lg:inline-flex">
            <Image src="instagram.svg" height={96} width={96} alt="instagram" />
          </Link>

          <Link href="/" className="lg:hidden inline-flex">
            <Image
              src="instagram-logo.svg"
              height={48}
              width={48}
              alt="instagram-logo"
            />
          </Link>
        </div>

        <div className="relative flex justify-center items-center">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-50 border border-gray-200 rounded text-sm w-full py-2 px-4 pl-10 max-w-[210px] focus:border-gray-500 focus:outline-none"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
            <FaSearch className="text-gray-400" />
          </div>
        </div>

        {session ? (
          <div>
            <DropdownMenu>
              <div className="flex flex-row items-center gap-4">
                <IoIosAddCircleOutline
                  className="text-3xl cursor-pointer"
                  onClick={() => setIsOpen(true)}
                />
                <DropdownMenuTrigger className="text-orange-500">
                  <Avatar>
                    <AvatarImage src={session.user.image} />
                    <AvatarFallback>{session.user.name}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
              </div>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {capitalizeName(session.user.name)}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={signOut}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <button
            onClick={signIn}
            className="text-sm font-semibold text-blue-500 "
          >
            Log In
          </button>
        )}
      </div>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          className="max-w-lg w-[90%] p-6 absolute top-56 left-[50%] translate-x-[-50%] bg-white border-2  rounded-md shadow-md"
          onRequestClose={() => setIsOpen(false)}
          ariaHideApp={false}
        >
          <div className="flex flex-col justify-center items-center h-[100%]">
            {selectedFile ? (
              <img
                onClick={() => setSelectedFile(null)}
                src={imageFileUrl}
                alt="Selected File"
                className={`w-full max-h-[250px] object-cover cursor-pointer ${
                  imageFileUploading ? "animate-pulse" : ""
                }`}
              />
            ) : (
              <HiCamera
                onClick={() => filePickerRef.current.click()}
                className="text-gray-400 text-6xl cursor-pointer"
              />
            )}
            <input
              hidden
              ref={filePickerRef}
              type="file"
              accept="image/*"
              onChange={addImageToPost}
            />
            <input
              type="text"
              maxLength={150}
              placeholder="Enter Caption..."
              className="m-4  text-center w-full focus:ring-0 border-none outline-none"
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <button
            disabled={
              !selectedFile ||
              caption.trim() === "" ||
              postUploading ||
              imageFileUploading
            }
            className="w-full bg-red-500 text-white p-2 shadow-md rounded-lg hover:brightness-105 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:hover:brightness-100"
            onClick={handleSubmit}
          >
            Upload Post
          </button>
          <AiOutlineClose
            className="cursor-pointer absolute top-2 right-2 hover:text-gray-900 transition duration-300"
            onClick={() => setIsOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Header;
