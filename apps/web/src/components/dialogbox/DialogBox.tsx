import React from "react";
import { useState } from "react";
"use client"

export const FriendDialogBox = (props: any) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[1000]">
      <div className="bg-white p-8 rounded-xl w-full max-w-[400px] shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold text-center">Add a Friend</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const email = (e.target as any).email.value
            console.log("Send request to:", email)
            props.setShowAddFriendDialog(false)
          }}
        >
          <input
            type="email"
            name="email"
            placeholder="Friend's email"
            required
            className="w-full p-3 mb-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              Send Request
            </button>
            <button
              type="button"
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              onClick={() => props.setShowAddFriendDialog(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


export const GroupDialogBox = (props: any) => {
  const [groupName, setGroupName] = useState("")
  const [participants, setParticipants] = useState<string[]>([""])

  const handleAddParticipant = () => {
    setParticipants([...participants, ""])
  }

  const handleParticipantChange = (index: number, value: string) => {
    const updated = [...participants]
    updated[index] = value
    setParticipants(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating group chat with:", groupName, participants)

    setGroupName("")
    setParticipants([""])
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[1000]">
      <div className="bg-white p-8 rounded-xl w-full max-w-[500px] shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold text-center">Create Group Chat</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            className="w-full p-3 mb-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="text-base font-medium mb-2">Participants</div>
          {participants.map((email, index) => (
            <input
              key={index}
              type="email"
              placeholder={`Participant ${index + 1} email`}
              value={email}
              onChange={(e) => handleParticipantChange(index, e.target.value)}
              required
              className="w-full p-3 mb-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}

          <button
            type="button"
            className="px-4 py-2 mb-4 text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            onClick={handleAddParticipant}
          >
            + Add Another
          </button>

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              onClick={() => props.setShowGroupModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
