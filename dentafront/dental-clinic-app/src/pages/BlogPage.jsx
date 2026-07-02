import { motion } from "framer-motion"
import PageWrapper from "../components/PageWrapper"
import { Card } from "../components/ui"
import { BLOG_POSTS } from "../lib/data"

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
}

export default function BlogPage() {
    return (
        <PageWrapper title="Blog" description="Stručni saveti i članci o oralnom zdravlju.">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Blog</h1>
                    <p className="mt-3 text-muted-foreground">Stručni saveti za zdrav osmeh.</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {BLOG_POSTS.map((post, i) => (
                        <motion.article
                            key={post.slug}
                            custom={i}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-60px" }}
                            variants={fadeUp}
                        >
                            <Card className="overflow-hidden p-0 h-full flex flex-col">
                                {post.image && (
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="h-48 w-full object-cover"
                                        onError={(e) => { e.target.style.display = "none" }}
                                    />
                                )}
                                <div className="flex flex-1 flex-col p-6">
                                    <h2 className="font-heading text-lg font-semibold text-foreground">{post.title}</h2>
                                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                                        <span>{new Date(post.date).toLocaleDateString("sr-RS")}</span>
                                        <span>•</span>
                                        <span>{post.author}</span>
                                    </div>
                                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <details className="mt-4">
                                        <summary className="cursor-pointer text-sm font-semibold text-primary hover:underline">
                                            Pročitaj više
                                        </summary>
                                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                                            {post.content}
                                        </p>
                                    </details>
                                </div>
                            </Card>
                        </motion.article>
                    ))}
                </div>
            </div>
        </PageWrapper>
    )
}