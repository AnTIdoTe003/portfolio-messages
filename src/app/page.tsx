"use client";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import axios from "axios";
import Loader from "@/components/ui/loader";
import JoditEditor from "jodit-react";

type Props = {};
const config = {
  readonly: false,
  placeholder: "Start typings...",
};

const Home = (props: Props) => {
  const [messages, setMessages] = useState([]);
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const[isMessageSending, setIsMessageSending] = useState(false);
  const [content, setContent] = useState("");
  const editor = useRef(null);

  const sendEmail = async (email: any) => {
    setIsMessageSending(true);
    try {
      const { data } = await axios.post(
        "https://nodemailer-backend-portfolio.vercel.app/api/v1/mail/send-mail",
        {
          userEmail: email,
          message: content,
        }
      );
      if (data.msg) {
        window.location.reload();
        setIsMessageSending(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          "https://nodemailer-backend-portfolio.vercel.app/api/v1/mail/get-all-mails"
        );
        if (data.success) {
          setIsLoading(false);
          setMessages(data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="w-full">
      <div className="container  max-w-[1440px]">
        <div className="w-full">
          <Dialog>
            <Table className="w-full">
              <TableCaption className="mb-5">
                A list of your recent messages.
              </TableCaption>
              <TableHeader className="w-full">
                <TableRow className="w-full">
                  <TableHead>Username</TableHead>
                  <TableHead className="text-center">Email</TableHead>
                  <TableHead className="text-center">Message</TableHead>
                  <TableHead className="text-right">Your Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="w-full">
                {isLoading ? (
                  <div className="w-[75vw] h-[100vh] flex flex-row items-center justify-center">
                    <Loader />
                  </div>
                ) : (
                  <>
                    {messages.map((ele: any) => {
                      return (
                        <TableRow key={ele._id}>
                          <TableCell>{ele.name}</TableCell>
                          <TableCell className="text-center">
                            {ele.email}
                          </TableCell>
                          <TableCell className="text-center">
                            {ele.message}
                          </TableCell>
                          <TableCell className="text-right">
                            <DialogTrigger className="bg-blue-200 w-[50px] h-[30px] rounded-md">
                              Reply
                            </DialogTrigger>
                          </TableCell>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Are you sure absolutely sure?
                              </DialogTitle>
                              <DialogDescription>
                                <JoditEditor
                                  ref={editor}
                                  value={content}
                                  config={config}
                                  onBlur={(newContent) =>
                                    setContent(newContent)
                                  }
                                />
                                <div className="flex gap-5 mt-5">
                                  {isMessageSending ? (
                                   <Button><Loader/></Button>
                                  ) : (
                                    <Button onClick={()=>sendEmail(ele.email)}>Send</Button>
                                  )}
                                  <DialogPrimitive.Close>
                                    <Button>Cancel</Button>
                                  </DialogPrimitive.Close>
                                </div>
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </TableRow>
                      );
                    })}
                  </>
                )}
              </TableBody>
            </Table>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Home;
