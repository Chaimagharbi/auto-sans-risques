import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {filterAdsDto} from './dto/filterAds.dto';
import {AdsDto} from './dto/ads.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Ads} from "./entities/ads.entity";
import {IAdsModel} from "./entities/ads.interface";
import {getPositionFromAddress} from "../shared/utils";
import {GenericRepository} from "../shared/generic/generic.repository";

@Injectable()
export class AdsService {
    private readonly adsRepository: GenericRepository<Ads>

    constructor(
        @InjectModel(Ads.name) private readonly adsModel: IAdsModel,
    ) {
        this.adsRepository = new GenericRepository(adsModel);
    }

    async createAds(AdsDto: AdsDto) {
        try {
            const ads = {...AdsDto}
            const position = await getPositionFromAddress(AdsDto.adresse + ' ' + AdsDto.ville);
            ads.lat = position ? position.lat : AdsDto.lat;
            ads.lng = position ? position.lng : AdsDto.lat;
            return await this.adsRepository.create(ads);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async fetchAdsPaginate(filterAdsDto: filterAdsDto) {
        try {
            return await this.adsRepository.aggregate(filterAdsDto);


            //let fromUser = filterAdsDto.role == 'EXPERT' ? 'experts' : 'clients';
            /*    pipelines.push({
              $lookup: { from: fromUser, localField: 'userId', foreignField: '_id', as: 'userId' }
            }); */
            /*  pipelines.push(  {
              $project: {
                _id:1,title: 1,body:1,url:1,img:1,lng:1,lag:1, userId: {$arrayElemAt:["$userId",0]}
              }
            }); */
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }

    async getAdById(id: any) {
        try {
            const pipelines = [];
            /*const ad = await this.adsModel.findById(id);
             const expert = await this.expertModel.findById(ad.userId);
            let fromUser = expert ? 'experts' : 'clients';
            pipelines.push({
              $match: {
                _id: Types.ObjectId(id)
              }
            });
            /*  pipelines.push({
              $lookup: { from: fromUser, localField: 'userId', foreignField: '_id', as: 'userId' }
            });
            pipelines.push(  {
              $project: {
                _id:1,title: 1,body:1,url:1,img:1,lng:1,lag:1, userId: {$arrayElemAt:["$userId",0]}
              }
            });
            console.log({ad,expert,pipelines})*/
            const ads = await this.adsModel.aggregate(pipelines);
            return ads[0];
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async updateAd(id: any, adsDto: AdsDto) {
        try {
            const ads = await this.adsModel.findById(id);
            console.log('update', {ads, adsDto});
            if (!ads) {
                return new NotFoundException('ads not found');
            }
            ads.title = adsDto.title;
            ads.body = adsDto.body;
            ads.url = adsDto.url;
            ads.img = adsDto.img;
            ads.typeUser = adsDto.typeUser;
            ads.isActive = adsDto.isActive;
            await ads.save();
            return ads;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async deleteAdById(id: any) {
        try {
            const ads = await this.adsModel.findByIdAndDelete(id);
            if (!ads) {
                return new NotFoundException('ads not found');
            }
            return 'ads deleted';
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async deleteAdsByIds(ids: any) {
        try {
            await this.adsModel.deleteMany({_id: {$in: ids}});
            return 'Ads deleted';
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

}
