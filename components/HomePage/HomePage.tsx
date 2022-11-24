import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { EPOCH_START } from "../../constants/values";
import { getStats } from "../../utils/infura";
import { delineate } from "../../utils/number";
import EpochBlock from "../common/EpochBlock";
import Style from "./HomePage.module.scss";

function epochformatted() {
    const epochStart = EPOCH_START;
    const epochPeriod = 1800;
    const hour = 60 * 60;
    const minute = 60;
    const unixTimeSec = Math.floor(Date.now() / 1000);

    let epochRemainder = unixTimeSec - epochStart;
    const epoch = Math.floor(epochRemainder / epochPeriod);
    epochRemainder -= epoch * epochPeriod;
    const epochHour = Math.floor(epochRemainder / hour);
    epochRemainder -= epochHour * hour;
    const epochMinute = Math.floor(epochRemainder / minute);
    epochRemainder -= epochMinute * minute;
    return `${epoch}-${epochMinute > 9 ? epochMinute : "0" + epochMinute.toString()
        }:${epochRemainder > 9 ? epochRemainder : "0" + epochRemainder.toString()}`;
}

type HomePageProps = {
    user: string;
};

function Epoch() {
    const [epochTime, setEpochTime] = useState("0-00:00");

    useEffect(() => {
        const id = setInterval(() => {
            setEpochTime(epochformatted());
        }, 1000);

        return () => {
            clearInterval(id);
        };
    });

    return (
        <Grid item xs={4}>
            <Box className={Style.stat_container} height={150} border={1}>
                <EpochBlock epoch={epochTime} />
            </Box>
        </Grid>
    );
}

const HomePage = ({ user }: HomePageProps) => {
    // const history = useHistory()

    const [price, setPrice] = useState("...");
    const [forgeYield, setForgeYield] = useState("...");
    const [poolYield, setPoolYield] = useState("...");
    const [forgeTotal, setForgeTotal] = useState("...");
    const [poolTotal, setPoolTotal] = useState("...");
    const [totalTvl, setTotalTvl] = useState("...");

    useEffect(() => {
        let isCancelled = false;

        async function updateUserInfo() {
            try {
                const stats: any = await getStats();
                console.log(stats);
                setPrice(stats.tPrice);
                setForgeYield(stats.forgeYield);
                setPoolYield(stats.poolYield);
                setForgeTotal(stats.forgeTvl);
                setPoolTotal(stats.poolTvl);
                setTotalTvl(stats.totalTvl);
            } catch (error) {
                console.log(error);
            }
        }

        updateUserInfo();
        const id = setInterval(updateUserInfo, 60000);

        // eslint-disable-next-line consistent-return
        return () => {
            isCancelled = true;
            clearInterval(id);
        };
    }, []);

    return (
        <div>
            <Container>
                <Grid container>
                    <Grid item xs={4}>
                        <Box className={Style.stat_container} height={150} border={1}>
                            <div style={{ fontSize: 16, padding: 3 }}>T Price</div>
                            <div
                                style={{
                                    fontSize: 24,
                                    padding: 3,
                                    fontWeight: 400,
                                    lineHeight: 1.5,
                                }}>
                                {"$" + Number(price).toFixed(3)}
                            </div>
                        </Box>
                    </Grid>

                    <Grid item xs={4}>
                        <Box className={Style.stat_container} height={150} border={1}>
                            <div style={{ fontSize: 16, padding: 3 }}>Total TVL</div>
                            <div
                                style={{
                                    fontSize: 24,
                                    padding: 3,
                                    fontWeight: 400,
                                    lineHeight: 1.5,
                                }}>
                                {"$" + totalTvl}
                            </div>
                        </Box>
                    </Grid>

                    <Epoch />

                    <Grid item xs={4}>
                        <Box className={Style.stat_container} height={150} border={1}>
                            <div style={{ fontSize: 16, padding: 3 }}>Forge Epoch Yield</div>
                            <div
                                style={{
                                    fontSize: 24,
                                    padding: 3,
                                    fontWeight: 400,
                                    lineHeight: 1.5,
                                }}>
                                {delineate(Number(forgeYield).toFixed(3)) + "%"}
                            </div>
                        </Box>
                    </Grid>

                    <Grid item xs={4}>
                        <Box className={Style.stat_container} height={150} border={1}>
                            <div style={{ fontSize: 16, padding: 3 }}>Forge APY</div>
                            <div
                                style={{
                                    fontSize: 24,
                                    padding: 3,
                                    fontWeight: 400,
                                    lineHeight: 1.5,
                                }}>
                                {delineate((Number(forgeYield) * 48 * 365).toFixed(3)) + "%"}
                            </div>
                        </Box>
                    </Grid>

                    <Grid item xs={4}>
                        <Box className={Style.stat_container} height={150} border={1}>
                            <div style={{ fontSize: 16, padding: 3 }}>Forge TVL</div>
                            <div
                                style={{
                                    fontSize: 24,
                                    padding: 3,
                                    fontWeight: 400,
                                    lineHeight: 1.5,
                                }}>
                                {"$" + delineate(Number(forgeTotal).toFixed(2))}
                            </div>
                        </Box>
                    </Grid>

                    <Grid item xs={4}>
                        <Box className={Style.stat_container} height={150} border={1}>
                            <div style={{ fontSize: 16, padding: 3 }}>Pool Epoch Yield</div>
                            <div
                                style={{
                                    fontSize: 24,
                                    padding: 3,
                                    fontWeight: 400,
                                    lineHeight: 1.5,
                                }}>
                                {delineate(Number(poolYield).toFixed(3)) + "%"}
                            </div>
                        </Box>
                    </Grid>

                    <Grid item xs={4}>
                        <Box className={Style.stat_container} height={150} border={1}>
                            <div style={{ fontSize: 16, padding: 3 }}>Pool APR</div>
                            <div
                                style={{
                                    fontSize: 24,
                                    padding: 3,
                                    fontWeight: 400,
                                    lineHeight: 1.5,
                                }}>
                                {delineate((Number(poolYield) * 48 * 365).toFixed(3)) + "%"}
                            </div>
                        </Box>
                    </Grid>

                    <Grid item xs={4}>
                        <Box className={Style.stat_container} height={150} border={1}>
                            <div style={{ fontSize: 16, padding: 3 }}>Pool TVL</div>
                            <div
                                style={{
                                    fontSize: 24,
                                    padding: 3,
                                    fontWeight: 400,
                                    lineHeight: 1.5,
                                }}>
                                {"$" + delineate(Number(poolTotal).toFixed(2))}
                            </div>
                        </Box>
                    </Grid>
                </Grid>

            </Container>
        </div>
    );
};

export default HomePage;
