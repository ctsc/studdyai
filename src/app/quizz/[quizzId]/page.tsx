import { db } from "@/db";

import {quizzes} from "@/db/schema";
import {eq} from 'drizzle-orm';
import QuizzQuestions from "../QuizzQuestions";
import { string } from "zod";

const page = async ({ params }: { params: {quizzId: string} }) => {
        const quizzId = parseInt(params.quizzId);

        if (isNaN(quizzId)) {
            return <div>invalid quiz id</div>
        }


        const quizz = await db.query.quizzes.findFirst({

            where: eq(quizzes.id, quizzId),
            with: {
                questions: {
                    with: {
                        answers: true
                    }
                }
            }
        })

        if (!quizzId || !quizz || !QuizzQuestions) {
            return <div>Quizz not found</div>
        }
        return(
            <div><QuizzQuestions quizz={quizz} /></div>
        )  
    }

export default page;



    