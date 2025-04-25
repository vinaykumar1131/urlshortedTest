import { Controller, Post, Body, Injectable, Req, Res, Param, Get } from '@nestjs/common';
import { URlService } from './url.service';
@Controller('url')
export class URLController {
    constructor(private readonly URlService: URlService) { }
    @Post('create')
    async signup(@Req() req: any, @Body('url') url: string, @Res() res: any) {
        try {
            const userId = req.user._id;
            const data = await this.URlService.createShortenUrl(url, userId)
            return res.status(200).json({ success: true, url: data })
        } catch (error) {
            return res.status(400).json({ success: false })
        }

    }
    @Get('getUrls')
    async getAllUserUrls(@Req() req: any, @Res() res: any) {
        try {
            const data = await this.URlService.findAllUrls(req.user._id)
            return res.status(200).json({ success: true, data })
        } catch (error) {
            return res.status(400).json({ success: false })

        }
    }
    @Get(':url')
    async redirect(@Req() req: any, @Param('url') url: string, @Res() res: any) {
        try {
            const userId = req.user._id;
            const data = await this.URlService.getShortenUrl(url, userId)
            return res.redirect(data.original)
        } catch (error) {
            return res.status(400).json({ success: false })
        }

    }




}
