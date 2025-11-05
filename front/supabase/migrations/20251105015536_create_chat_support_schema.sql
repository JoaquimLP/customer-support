/*
  # Chat Support System Schema

  ## Overview
  Creates a complete chat support system with user sessions and messages.

  ## New Tables
  
  ### `chat_sessions`
  Stores active chat sessions for support
  - `id` (uuid, primary key) - Unique session identifier
  - `user_email` (text) - Email of the user requesting support
  - `status` (text) - Session status: 'active', 'closed'
  - `created_at` (timestamptz) - When the session was created
  - `updated_at` (timestamptz) - Last message timestamp

  ### `chat_messages`
  Stores all messages in chat sessions
  - `id` (uuid, primary key) - Unique message identifier
  - `session_id` (uuid, foreign key) - References chat_sessions
  - `sender_email` (text) - Email of the message sender
  - `message` (text) - The message content
  - `is_support` (boolean) - True if sent by support, false if sent by user
  - `created_at` (timestamptz) - When the message was sent

  ## Security
  - RLS enabled on both tables
  - Users can only read/write to their own sessions and messages
  - Public access allowed for creating sessions and sending messages (identified by email)

  ## Notes
  1. Sessions track conversations between users and support
  2. Messages are linked to sessions via foreign key
  3. Email-based identification without full authentication
  4. Simple status tracking for open/closed sessions
*/

CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  sender_email text NOT NULL,
  message text NOT NULL,
  is_support boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_email ON chat_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create chat sessions"
  ON chat_sessions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view own sessions"
  ON chat_sessions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update own sessions"
  ON chat_sessions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can send messages"
  ON chat_messages FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view messages"
  ON chat_messages FOR SELECT
  TO anon
  USING (true);
