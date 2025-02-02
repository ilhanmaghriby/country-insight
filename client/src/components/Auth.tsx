import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import { Session } from "@supabase/supabase-js";
import { AuthChangeEvent } from "@supabase/supabase-js";

export default function Auth() {
  const [session, setSession] = useState<Session | null>(null);
  const [showButton, setShowButton] = useState(false);

  // Function to handle profile click
  const handleProfileClick = () => {
    setShowButton((prevState) => !prevState); // Toggle button visibility
  };

  // Fetch session on component mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Function to handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // Function to handle login with Google
  const handleLoginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.error("Error during login:", error.message);
    }
  };

  // Render the login/logout button
  if (!session) {
    return (
      <div className="absolute top-0 right-0 mt-3 mr-4">
        <button
          className="px-4 py-2 border flex gap-2 border-slate-200  rounded-lg text-slate-700  hover:border-slate-400  hover:text-slate-900  hover:shadow transition duration-150"
          onClick={handleLoginWithGoogle}
        >
          <img
            className="w-6 h-6"
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            loading="lazy"
            alt="google logo"
          />
          <span className="hidden md:inline">Login with Google</span>
        </button>
      </div>
    );
  } else {
    return (
      <div className="absolute top-0 right-0">
        <div className="shrink-0 group block mt-3 mr-4">
          <div className="flex items-center" onClick={handleProfileClick}>
            <img
              className="inline-block shrink-0 h-10 w-10 rounded-full"
              src={session.user?.user_metadata.avatar_url}
              alt="Avatar"
            />
            <div className="ms-3 hidden md:block">
              <h3 className="font-semibold text-gray-800 ">
                {session.user?.user_metadata.full_name}
              </h3>
              <p className="text-sm font-medium text-gray-400 dark:text-neutral-500">
                {session.user?.email}
              </p>
            </div>
          </div>
        </div>
        {showButton && (
          <div className="absolute top-13 right-0md:top-13 md:right-21 mt-2 w-24 md:w-40 bg-white shadow-lg rounded-lg border border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-t-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    );
  }
}
