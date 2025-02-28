import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Checkbox } from "./components/ui/checkbox";
import { Label } from "./components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion"; // Import framer-motion
import "./App.css"; // Import custom CSS for animations and styles
import Markdown from "./components/Markdown";

const formSchema = z.object({
  question: z.string().min(2, {
    message: "Question must be at least 2 characters.",
  }),
  quantity: z.coerce
    .number()
    .min(1, {
      message: "Quantity must be at least 1.",
    })
    .max(20, {
      message: "Quantity must be at most 20.",
    }),
  isCrazy: z.boolean().default(false),
  workshop_method: z.enum(["hmw", "opposite", "bad idea", "free text"]),
});

function App() {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [body, setBody] = useState<any>(null);
  const [showIframe, setShowIframe] = useState(false);

  // React Hook Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      quantity: 5,
      isCrazy: false,
      workshop_method: "hmw",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    setIdeas([]); // Clear previous ideas

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/idea_generator`, // Replace with your API URL
        values
      );

      setIdeas(response.data.idea_list);
      toast.success("Ideas generated successfully!");
    } catch (e: any) {
      setError(e.message || "Failed to generate ideas.");
      toast.error(`Error: ${e.message || "Failed to generate ideas."}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchBody = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/idea_generator`
        );
        setBody(response.data);
      } catch (error: any) {
        console.error("Error fetching body:", error);
        setError(error.message || "Failed to fetch body.");
      }
    };

    fetchBody();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.6,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        type: "spring",
      },
    },
  };

  return (
    <motion.div
      className="container mx-auto p-4 w-full app-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4 text-center"
        variants={itemVariants}
      >
        Idea Generator
      </motion.h1>
      {/* <motion.button
      onClick={() => setShowIframe(!showIframe)}
      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-pink-500 hover:to-yellow-500 text-white font-bold py-2 px-4 rounded mb-4 shadow-md transition duration-300 ease-in-out transform hover:scale-105"
      variants={itemVariants}
      >
      {showIframe ? "Hide Miro Plugin" : "Show Miro Plugin"}
      </motion.button> */}

      {showIframe && (
        <motion.iframe
          src={`${import.meta.env.VITE_API_URL}/static_pages/plugin_main.html`} // Adjust the path as necessary
          title="Miro Plugin"
          width="100%"
          height="600px"
          variants={itemVariants}
        />
      )}

      <motion.div variants={itemVariants}>
        <Card className="bg-gray-50 shadow-xl rounded-2xl overflow-hidden border-2 border-gray-200">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              Brainstorm Ideas
            </CardTitle>
            <CardDescription className="text-md text-gray-700">
              Unleash your creativity with our idea generator.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 text-sm font-bold mb-2">
                        Question
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What problem are you trying to solve?"
                          {...field}
                          className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm py-2 px-3"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 text-sm font-bold mb-2">
                        Quantity
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Number of ideas to generate"
                          {...field}
                          className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm py-2 px-3"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="workshop_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 text-sm font-bold mb-2">
                        Workshop Method
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm py-2 px-3">
                            <SelectValue placeholder="Select a workshop method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="shadow-md rounded-md border border-gray-200">
                          <SelectItem value="hmw">How Might We</SelectItem>
                          <SelectItem value="opposite">
                            Opposite Thinking
                          </SelectItem>
                          <SelectItem value="bad idea">Bad Idea</SelectItem>
                          <SelectItem value="free text">Free Text</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isCrazy"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 rounded-md border p-4 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mr-2"
                        />
                      </FormControl>
                      <div className="space-y-0.5">
                        <FormLabel
                          htmlFor="isCrazy"
                          className="text-gray-700 font-bold text-sm"
                        >
                          Crazy Ideas?
                        </FormLabel>
                        <CardDescription className="text-gray-500 text-xs">
                          Generate unusual suggestions.
                        </CardDescription>
                      </div>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white font-bold py-3 px-5 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105 w-full"
                >
                  {loading ? "Generating..." : "Generate Ideas"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
      {error && (
        <motion.div className="text-red-500 mt-4" variants={itemVariants}>
          Error: {error}
        </motion.div>
      )}
      {/* 
      {body && (
      <div className="mt-4">
      <h2 className="text-lg font-bold mb-2">Body from API:</h2>
      <pre>{JSON.stringify(body, null, 2)}</pre>
      </div>
      )} */}

      {ideas.length > 0 && (
        <motion.div className="mt-4" variants={itemVariants}>
          <h2 className="text-lg font-bold mb-2">Generated Ideas:</h2>
          <ul className="list-disc pl-5">
            {ideas.map((idea, index) => (
              <Markdown key={index} text={idea} />
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}

export default App;
