import React from "react";
import MiniProfile from "./MiniProfile";
import Posts from "./Posts";

const Feed = () => {
  return (
    <main className="grid grid-cols-1 md:grid-cols-3 md:max-w-6xl mx-auto">
      {/*Left side => POSTS */}
      <section className="md:col-span-2">
        <Posts />
      </section>
      {/* Right Side => Mini Profile */}
      <section className="hidden md:inline-grid md:col-span-1">
        <div className="fixed w-[380px]">
          <MiniProfile />
        </div>
      </section>
    </main>
  );
};

export default Feed;
