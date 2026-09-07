from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math, os, textwrap

FRAMES = Path("/workspace/acts1-video/work_v2/frames")
W, H, FPS, BANNER_H = 1280, 720, 15, 110
GOLD = (230, 180, 50)
INK = (30, 30, 40)
WHITE = (255, 255, 255)
SHIRTS = [(70,130,200),(200,80,80),(60,150,120),(180,120,50),(140,90,180),(50,100,160),(210,140,60),(90,160,90),(160,70,110),(80,110,170),(190,160,50)]

def font(size, bold=False):
    p = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    try: return ImageFont.truetype(p, size)
    except Exception: return ImageFont.load_default()

def lerp(a,b,t): return a+(b-a)*t

def gradient(img, top, bot, y0, y1):
    d = ImageDraw.Draw(img)
    for y in range(y0, y1):
        t = (y-y0)/max(y1-y0-1,1)
        c = tuple(int(lerp(top[i], bot[i], t)) for i in range(3))
        d.line([(0,y),(W,y)], fill=c)

def caption(img, ref, text):
    d = ImageDraw.Draw(img)
    d.rectangle([0, H-BANNER_H, W, H], fill=(20,30,55))
    d.rectangle([0, H-BANNER_H, W, H-BANNER_H+5], fill=GOLD)
    d.text((36, H-BANNER_H+14), ref, fill=GOLD, font=font(24, True))
    y = H-BANNER_H+46
    for line in textwrap.wrap(text, 70)[:2]:
        d.text((36, y), line, fill=WHITE, font=font(22)); y += 28

def stick(d, x, y, scale=1.0, phase=0.0, walk=False, arms="down", look="forward", shirt=(70,130,200), outline=INK):
    s=scale; lw=max(2,int(3.2*s)); r=int(13*s)
    swing=math.sin(phase*math.pi*2) if walk else 0.0
    leg_l=swing*22*s; leg_r=-swing*22*s; arm_swing=-swing*16*s if walk else 0.0
    hx,hy=int(x),int(y)
    d.ellipse([hx-r,hy-r,hx+r,hy+r], outline=outline, width=lw, fill=(255,230,200))
    eye_y = hy - (7 if look=="up" else 2)*s
    ex = -3*s if look=="left" else (3*s if look=="right" else 0)
    eye_y=int(eye_y); ex=int(ex)
    d.ellipse([hx-int(5*s)+ex,eye_y,hx-int(2*s)+ex,eye_y+int(3*s)], fill=outline)
    d.ellipse([hx+int(2*s)+ex,eye_y,hx+int(5*s)+ex,eye_y+int(3*s)], fill=outline)
    body_bot=hy+int(52*s); shoulder=hy+int(20*s)
    d.polygon([(hx-int(14*s),shoulder),(hx+int(14*s),shoulder),(hx+int(12*s),body_bot-4),(hx-int(12*s),body_bot-4)], fill=shirt, outline=outline)
    d.line([(hx,hy+r),(hx,body_bot)], fill=outline, width=lw)
    ax,ay=int(26*s),int(20*s)
    if arms=="up":
        L=(hx-int(18*s),hy-int(12*s)); R=(hx+int(18*s),hy-int(12*s))
    elif arms=="pray":
        L=(hx-int(8*s),shoulder-int(18*s)); R=(hx+int(8*s),shoulder-int(18*s))
    elif arms=="wave":
        L=(hx-ax,shoulder+ay); R=(hx+int(22*s),hy-int(8*s)+int(math.sin(phase*8)*6))
    elif arms=="gesture":
        L=(hx-ax+int(arm_swing),shoulder+ay); R=(hx+int(28*s),shoulder-int(6*s)+int(math.sin(phase*4)*8))
    elif arms=="out":
        L=(hx-int(36*s),shoulder+4); R=(hx+int(36*s),shoulder+4)
    else:
        L=(hx-ax+int(arm_swing),shoulder+ay); R=(hx+ax-int(arm_swing),shoulder+ay)
    d.line([(hx,shoulder),L], fill=outline, width=lw)
    d.line([(hx,shoulder),R], fill=outline, width=lw)
    ly=int(34*s)
    d.line([(hx,body_bot),(hx-int(16*s)+int(leg_l),body_bot+ly)], fill=outline, width=lw)
    d.line([(hx,body_bot),(hx+int(16*s)+int(leg_r),body_bot+ly)], fill=outline, width=lw)

def halo(d,x,y,t=0):
    rr=int(20+math.sin(t*4)*2)
    d.ellipse([x-rr,y-rr-10,x+rr,y-rr+4], outline=GOLD, width=3)

def flame(d,x,y,t=0,scale=1):
    flicker=1+0.15*math.sin(t*10+x); h=int(28*scale*flicker); w=int(14*scale)
    d.polygon([(x,y-h),(x-w,y+4),(x+w,y+4)], fill=GOLD, outline=(220,100,40))

def cloud(d,x,y,sc=1):
    for ox,oy,rw,rh in [(-40,10,70,40),(0,-10,90,50),(50,8,65,38)]:
        d.ellipse([x+int(ox*sc),y+int(oy*sc),x+int((ox+rw)*sc),y+int((oy+rh)*sc)], fill=(245,248,255), outline=(200,210,230))
