import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const title = searchParams.get('title') || 'Isaiah Ozadhe - Software Engineering Blog'
        const subtitle = searchParams.get('subtitle') || 'Software engineer sharing insights on engineering solutions.'

        return new ImageResponse(
            (
                <div
                    style={{
                        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        fontFamily: 'Inter',
                        position: 'relative',
                    }}
                >
                    {/* Grid pattern background */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            opacity: 0.1,
                            backgroundImage: `
                linear-gradient(90deg, #ffffff 1px, transparent 1px),
                linear-gradient(0deg, #ffffff 1px, transparent 1px)
              `,
                            backgroundSize: '40px 40px',
                        }}
                    />

                    {/* Content */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            maxWidth: '900px',
                            padding: '0 40px',
                            zIndex: 1,
                        }}
                    >
                        {/* Logo/Icon */}
                        {/* Logo from public/logo.png */}
                        <img
                            src="https://blog.isaiahozadhe.tech/logo.png"
                            alt="Isaiah Ozadhe Blog Logo"
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '20px',
                                objectFit: 'cover',
                                marginBottom: '40px',
                                boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                                background: '#fff',
                            }}
                        />

                        {/* Title */}
                        <h1
                            style={{
                                fontSize: title.length > 60 ? '48px' : '64px',
                                fontWeight: 'bold',
                                color: '#ffffff',
                                margin: '0 0 20px 0',
                                lineHeight: 1.2,
                                textAlign: 'center',
                            }}
                        >
                            {title}
                        </h1>

                        {/* Subtitle */}
                        <p
                            style={{
                                fontSize: '24px',
                                color: '#a1a1aa',
                                margin: '0 0 40px 0',
                                textAlign: 'center',
                                lineHeight: 1.4,
                            }}
                        >
                            {subtitle}
                        </p>

                        {/* Bottom brand */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                fontSize: '18px',
                                color: '#71717a',
                            }}
                        >
                            <span>blog.isaiahozadhe.tech</span>
                        </div>
                    </div>

                    {/* Accent dots */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '60px',
                            right: '60px',
                            width: '120px',
                            height: '120px',
                            background: 'radial-gradient(circle, #ffffff20, transparent)',
                            borderRadius: '50%',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '60px',
                            left: '60px',
                            width: '80px',
                            height: '80px',
                            background: 'radial-gradient(circle, #ffffff15, transparent)',
                            borderRadius: '50%',
                        }}
                    />
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        )
    } catch (e: any) {
        console.log(`${e.message}`)
        return new Response(`Failed to generate the image`, {
            status: 500,
        })
    }
}