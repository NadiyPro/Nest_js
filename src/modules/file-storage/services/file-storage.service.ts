import { randomUUID } from 'node:crypto';
import * as path from 'node:path';

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AwsConfig, Config } from '../../../configs/config.type';
import { LoggerService } from '../../logger/logger.service';
import { ContentType } from '../enums/content-type.enum';

@Injectable()
export class FileStorageService {
  private readonly awsConfig: AwsConfig;
  // зберігає параметри AWS з нашого конфігураційного файлу AwsConfig
  private readonly s3Client: S3Client;
  //  клієнт AWS S3, налаштований для роботи з обліковими даними та
  //  іншими параметрами (наприклад, endpoint, region)

  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.awsConfig = this.configService.get<AwsConfig>('aws');
    this.s3Client = new S3Client({
      forcePathStyle: true,
      endpoint: this.awsConfig.endpoint,
      // URL хмарного сховища (MinIO), тобто хост з .env
      region: this.awsConfig.region,
      //  регіон AWS вказуємо авансом,
      //  щоб можна при необхідності легко переключитись з MinIO на AWS
      //  змінивши сікрети в .env (регіон в MinIO цей параметр не використовує)
      credentials: {
        accessKeyId: this.awsConfig.accessKey,
        secretAccessKey: this.awsConfig.secretKey,
      }, //  облікові дані AWS для доступу до S3 (access токен та сікрет кей)
    });
  }

  public async uploadFile(
    file: Express.Multer.File,
    // приймає зчитаний файл
    itemType: ContentType,
    // в ContentType вказані типи: 'image'/'video'/'audio'/'document'/'other'
    itemId: string, // ідентифікатор елементу
    // file,itemType,itemId - це дані для побудови шляху збереження
  ): Promise<string> {
    try {
      const filePath = this.buildPath(itemType, itemId, file.originalname);
      // для генерації унікального шляху для файлу на основі типу файлу,
      // ідентифікатора та розширення, сам код методу прописаний вкінці
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.awsConfig.bucketName,
          Key: filePath,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
          // але краще тут теж було прописати через this.awsConfig.ACL
        }),
        // Відправляє PutObjectCommand через s3Client,
        // щоб завантажити файл у S3-бакет
      );

      return filePath; // повертає шлях до файлу
    } catch (error) {
      this.logger.error(error);
      // якщо завантаження НЕ успішне поверне помилку
    }
  }

  public async deleteFile(filePath: string): Promise<void> {
    // filePath шлях до файлу, який треба видалити
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.awsConfig.bucketName,
          Key: filePath,
        }), //  щоб видалити файл із S3-бакету за вказаним шляхом
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  private buildPath(
    itemType: ContentType,
    itemId: string,
    fileName: string,
  ): string {
    return `${itemType}/${itemId}/${randomUUID()}${path.extname(fileName)}`;
  }
  // для генерації унікального шляху для файлу на основі типу файлу,
  // ідентифікатора, randomUUID() - який генерує унікальний ідентифікатор та розширення
  // Результат виглядає як тип_елемента/ідентифікатор_елемента/унікальний_ідентифікатор.розширення
}
// для завантаження та видалення файлів у хмарному сховищі MinIO
// Клас використовує AWS SDK для взаємодії зі сховищем
// та конфігурацію для отримання необхідних параметрів
// MinIO і AWS S3 не синхронізовані автоматично, але MinIO підтримує API,
// сумісний із S3, що дозволяє використовувати клієнтські інструменти та SDK для S3
// (наприклад, @aws-sdk/client-s3) для роботи з MinIO так само, як із Amazon S3.
// Це означає, що ви можете писати код для взаємодії з MinIO,
// використовуючи знайомі інструменти для S3
