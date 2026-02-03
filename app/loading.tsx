export default function Loading() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: -1 // Behind navbar
        }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan"></div>
        </div>
    )
}
