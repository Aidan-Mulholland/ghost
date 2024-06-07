"use client";

type DirectMessageProps = {
  params: {
    userid: number;
  };
};

export default function DirectMessage({ params }: DirectMessageProps) {
  return <h1>{params.userid}</h1>;
}
