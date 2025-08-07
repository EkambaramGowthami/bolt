import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Bolt, Gift, X } from "lucide-react";
import { Group } from "../symbols/Goup";

export const Tokens = ({ setgetToken }: any) => {
  const referredByRef = useRef<HTMLInputElement>(null);
  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState<any>(null);
  const [tokens, setTokens] = useState<any>(null);
  const [transaction, setTransaction] = useState<any>([]);

  const fetchAllData = async () => {
    try {
      const [userRes, tokenRes, transactionRes] = await Promise.all([
        axios.get(`http://localhost:3000/user/${userId}`),
        axios.get(`http://localhost:3000/token/${userId}`),
        axios.get(`http://localhost:3000/transactions/${userId}`),
      ]);

      setUser(userRes.data);
      setTokens(tokenRes.data);
      setTransaction(transactionRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    if (userId) fetchAllData();
  }, [userId]);

  const handleCopyString = async () => {
    const referredBy = referredByRef.current?.value?.trim();
    if (!referredBy) {
      alert("Please enter a referral code.");
      return;
    }

    if (referredBy) {
      await axios.post(`http://localhost:3000/referral/${userId}`, {
        referredBy
      });
    }
  };

  return (
    <div className="bg-gray-500 bg-opacity-20 rounded-lg shadow-lg top-6 p-4">
      <div className="flex justify-between items-center">
        <div className="rounded-full text-blue-500 bg-blue-500 bg-opacity-40 p-2">
          <Gift />
        </div>
        <div onClick={() => setgetToken(false)} className="text-white cursor-pointer">
          <X />
        </div>
      </div>

      <div className="text-2xl font-semibold text-white mt-6">
        Refer Users: Earn Tokens
      </div>

      <div className="text-gray-500 mt-2">
        Earn <span className="text-white text-xl font-md">200K tokens</span> for
        yourself & each new user you refer.
      </div>

      <div className="text-gray-500 mt-4">
        Pro users: earn an additional{" "}
        <span className="text-white text-xl font-md">5M tokens</span> for yourself &
        your referral when they upgrade to a Pro account within 30 days!
      </div>

      <div className="mt-4 shadow-lg bg-black px-full py-4 rounded p-4">
        <div className="text-gray-500 text-sm">Referral tokens earned</div>
        <div className="flex justify-between items-center text-white text-3xl font-semibold">
          <div>{tokens?.total ?? 0}</div>
          <Bolt />
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <div className="px-16 py-4 rounded bg-black">
          <div className="text-gray-500 text-sm">Free Referrals</div>
          <div className="flex justify-between items-center text-white text-3xl font-semibold">
            <div>{tokens?.free ?? 0}</div>
            <Group />
          </div>
        </div>

        <div className="px-16 py-4 rounded bg-black">
          <div className="text-blue-500 text-lg font-normal">Upgrade to pro</div>
          <div className="text-white text-sm font-light">
            to unlock pro referrals
          </div>
        </div>
      </div>

      <div className="text-white font-normal text-lg mt-4">
        Use your personal referral link to invite users to join Bolt:
      </div>

      <div className="flex justify-between mt-2">
        <input
          type="text"
          placeholder="Enter referral code"
          className="px-16 py-2 rounded bg-black text-white placeholder:text-gray-500"
          ref={referredByRef}
        />
        <button
          className="text-white bg-blue-500 rounded p-2 ml-2"
          onClick={handleCopyString}
        >
          Apply Code
        </button>
      </div>
    </div>
  );
};
