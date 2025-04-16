import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { JsonOutputFunctionsParser } from "langchain/output_parsers"
import path from "path";
import * as fs from "fs/promises";
import os from "os";
import {randomUUID} from "crypto";

import { error } from "console";

export async function POST(req: NextRequest) {
    const body = await req.formData();
    const document = body.get("pdf") as File;

    if (!document) {
        return NextResponse.json({error: "No PDF uploaded" }, {status:400});
    }

    const bytes = await document.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const tempFilePath = path.join(os.tmpdir(), `${randomUUID()}.pdf`);
    await fs.writeFile(tempFilePath, buffer);



    try {
        const pdfLoader = new PDFLoader(tempFilePath, {
            parsedItemSeparator: " "
        });
        const docs = await pdfLoader.load();

        const selectedDocuments = docs.filter((doc) => doc.pageContent);
        const texts = selectedDocuments.map((doc) => doc.pageContent);

        const prompt = "given the text which is a summary of the document, generate a quiz based on the text. Return json only that contains a quizz object with fields: name, description and questions. The questions is an array of objects with fields: questionText, answers. The answers is an array of objects with fields: answerText, isCorrect."
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
            { error: "OpenAI api key not provided"}, 
            { status: 500}
    );
}
        const model = new ChatOpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: "gpt-3.5-turbo"
        });

        const parser = new JsonOutputFunctionsParser();
        const extractionFunctionSchema = {
            name: "extractor",
            description: "Extracts fields from the output",
            parameters: {
                type: "object",
                properties: {
                    quizz: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            description: { type: 'string'},
                            questions: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        questionText: {type: "string"},
                                        answers: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    answerText: {type: "string"},
                                                    isCorrect: {type:"boolean"},
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    }
                }
            };
        
        const runnable = model
        .bind({
            functions: [extractionFunctionSchema],
            function_call: { name: "extractor"}
        })
        .pipe(parser);



        const message = new HumanMessage({
            content: [
                {
                    type: "text",
                    text: prompt + "\n" + texts.join("\n")
                }
            ]
         })

        const result = await runnable.invoke([message]);
        console.log(result);

        return NextResponse.json(
            { message: "created success"}, 
            { status: 200}
        );
        } catch(e: any) {
            console.error("PDF processing failed:", e);
            return NextResponse.json({ message: "creation error"}, { status: 500});
        } finally{
            await fs.unlink(tempFilePath);
        }
    
    }