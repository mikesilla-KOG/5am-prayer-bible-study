import sys, math
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from vid.common import *

START = 0
N = 18 * FPS

def main():
    FRAMES.mkdir(parents=True, exist_ok=True)
    for i in range(N):
        t=i/max(N-1,1); ts=i/FPS
        img=Image.new("RGB",(W,H)); gradient(img,(90,170,245),(200,230,255),0,480)
        d=ImageDraw.Draw(img)
        d.ellipse([-100,380,700,620], fill=(95,175,105))
        d.ellipse([500,400,1400,650], fill=(70,160,90))
        d.rectangle([0,500,W,H-BANNER_H], fill=(50,130,70))
        d.ellipse([1060,50,1140,130], fill=(255,220,120))
        jx,jy=780,340+int(math.sin(ts*2)*4)
        halo(d,jx,jy,ts)
        stick(d,jx,jy,1.35,ts*0.5,arms="gesture",shirt=(245,245,255),outline=(90,60,160))
        if t>0.35: flame(d,jx,jy-55,ts,1.3)
        for k,sx in enumerate([80,160,240,320,400,480]):
            gx=[420,500,560,620,680,740][k]
            wt=min(1.0,t/0.45); x=lerp(sx,gx,wt*wt)
            y=380+int(math.sin(ts*3+k)*3)
            walking=wt<0.95
            arms="down"; look="forward"
            if not walking:
                arms="up" if (int(ts*2)+k)%3==0 else ("pray" if t>0.7 else "out")
                look="up" if t>0.55 else "right"
            stick(d,x,y,1.0,ts*1.6+k*0.2,walk=walking,arms=arms,look=look,shirt=SHIRTS[k%len(SHIRTS)])
        if t<0.5:
            caption(img,"Acts 1:4-5","Wait for the promise of the Father... ye shall be baptized with the Holy Ghost.")
        else:
            caption(img,"Acts 1:8","Ye shall receive power... and ye shall be witnesses unto me.")
        img.save(FRAMES/f"f_{START+i:06d}.png")
        if i%60==0: print("s1", i)
    print("s1 done", N)

if __name__=="__main__":
    main()
