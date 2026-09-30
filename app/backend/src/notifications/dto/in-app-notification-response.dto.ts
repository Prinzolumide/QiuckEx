import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { InAppNotification } from "../entities/in-app-notification.entity";
import { NotificationEventType } from "../types/notification.types";

export class InAppNotificationResponseDto implements InAppNotification {
  @ApiProperty({ example: "2d2ef5a1-87f7-42f8-9b6c-85f5b5ec7d19" })
  id!: string;

  @ApiProperty({ example: "GTEST123..." })
  publicKey!: string;

  @ApiProperty({ enum: NotificationEventType })
  eventType!: NotificationEventType;

  @ApiProperty({ example: "evt_123" })
  eventId!: string;

  @ApiProperty({ example: "Payment Received" })
  title!: string;

  @ApiProperty({ example: "You received 100 XLM from GABCD..." })
  body!: string;

  @ApiProperty({ example: false })
  read!: boolean;

  @ApiPropertyOptional({ example: { amount: "100", asset: "XLM" } })
  metadata?: Record<string, unknown>;

  @ApiProperty({ example: "2026-09-27T17:18:50Z" })
  createdAt!: string;
}